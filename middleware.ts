import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'puja-collection-rangeli-secret-key-2026';

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [data, signatureHex] = parts;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(ADMIN_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const match = signatureHex.match(/.{1,2}/g);
    if (!match) return false;
    const sigBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
    const isValidSig = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));

    if (!isValidSig) return false;

    const payload = JSON.parse(atob(data));
    if (Date.now() > payload.expiresAt) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes (excluding login & session status check)
  if (
    pathname.startsWith('/api/admin/') &&
    !pathname.startsWith('/api/admin/login') &&
    !pathname.startsWith('/api/admin/session')
  ) {
    const sessionCookie = request.cookies.get('puja_admin_session')?.value;
    const isValid = await isValidSession(sessionCookie);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid Admin Session Required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
