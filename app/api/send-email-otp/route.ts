import { NextResponse } from 'next/server';
import { checkRateLimit, generateAndStoreOtp } from '@/lib/auth/otpStore';
import { sendEmailWithResend, renderEmailOtpTemplate } from '@/lib/email/resend';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid customer email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Rate Limit (Max 3 OTP requests per 10 mins per email)
    const { limited, retryAfterSeconds } = checkRateLimit(cleanEmail);
    if (limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many OTP requests. Please wait ${retryAfterSeconds || 60} seconds before requesting a new code.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSeconds || 60) },
        }
      );
    }

    // 2. Generate and store 6-digit OTP
    const serverGeneratedOtp = generateAndStoreOtp(cleanEmail);

    // 3. Dispatch luxury HTML email via Resend
    const htmlBody = renderEmailOtpTemplate(serverGeneratedOtp, name);
    const emailResult = await sendEmailWithResend({
      to: cleanEmail,
      subject: `[Puja Collection] Your Cash on Delivery Verification Code: ${serverGeneratedOtp}`,
      html: htmlBody,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to dispatch email verification code.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`,
    });
  } catch (error: unknown) {
    console.error('Email OTP API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error while dispatching email verification code.' },
      { status: 500 }
    );
  }
}
