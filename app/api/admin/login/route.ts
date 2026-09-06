import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createSessionToken, COOKIE_NAME } from '@/lib/auth/adminAuth';
import { checkLoginRateLimit, recordFailedLogin, recordSuccessfulLogin } from '@/lib/auth/loginRateLimiter';
import { recordAuditLog } from '@/lib/auth/adminAudit';

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const userAgent = req.headers.get('user-agent') || 'Unknown User-Agent';

  try {
    // 1. Rate Limit / Lockout Check
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      recordAuditLog({
        eventType: 'LOGIN_LOCKOUT',
        actor: 'Unknown / Blocked IP',
        ipAddress: clientIp,
        userAgent,
        details: `Login blocked by IP lockout. Cooldown remaining: ${rateCheck.retryAfterSeconds}s`,
        severity: 'CRITICAL',
      });

      return NextResponse.json(
        {
          success: false,
          error: `Security Lockout: Too many failed login attempts from this IP. Please wait ${Math.ceil(
            (rateCheck.retryAfterSeconds || 900) / 60
          )} minutes before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds || 900) },
        }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Store manager email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Timing-safe credentials verification
    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      // Artificial delay (600ms) to defeat automated fast-loop password guessing
      await new Promise((resolve) => setTimeout(resolve, 600));

      const failedStatus = recordFailedLogin(clientIp);

      recordAuditLog({
        eventType: 'LOGIN_FAILED',
        actor: String(email).slice(0, 50),
        ipAddress: clientIp,
        userAgent,
        details: failedStatus.isLocked
          ? 'Threshold reached (5 failed attempts). IP locked out for 15 minutes.'
          : `Invalid password attempt. Remaining attempts: ${failedStatus.remainingAttempts}`,
        severity: failedStatus.isLocked ? 'CRITICAL' : 'WARNING',
      });

      if (failedStatus.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Security Lockout: 5 failed attempts reached. Access locked for 15 minutes.',
          },
          {
            status: 429,
            headers: { 'Retry-After': String(failedStatus.retryAfterSeconds || 900) },
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid store credentials. ${failedStatus.remainingAttempts} attempt(s) remaining before temporary lockout.`,
        },
        { status: 401 }
      );
    }

    // 3. Login Succeeded!
    recordSuccessfulLogin(clientIp);

    recordAuditLog({
      eventType: 'LOGIN_SUCCESS',
      actor: String(email).slice(0, 50),
      ipAddress: clientIp,
      userAgent,
      details: 'Store Owner authenticated successfully.',
      severity: 'INFO',
    });

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully as Store Owner.',
    });

    // 4. Strict Production Cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err: unknown) {
    console.error('Error during admin login:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication error occurred.' },
      { status: 500 }
    );
  }
}
