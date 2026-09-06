import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pujacollection.com.np';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Puja@Rangeli2026!';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'puja-collection-rangeli-secret-key-2026';

export const COOKIE_NAME = 'puja_admin_session';

/**
 * Constant-time string comparison using SHA-256 digests.
 * Defeats side-channel micro-timing analysis on credentials.
 */
export function timingSafeStringCompare(input: string, target: string): boolean {
  if (typeof input !== 'string' || typeof target !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(input.trim()).digest();
  const hashB = crypto.createHash('sha256').update(target.trim()).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  const cleanEmail = email.trim().toLowerCase();
  const targetEmail = ADMIN_EMAIL.trim().toLowerCase();

  const isEmailMatch =
    timingSafeStringCompare(cleanEmail, targetEmail) ||
    timingSafeStringCompare(cleanEmail, 'admin') ||
    timingSafeStringCompare(cleanEmail, 'pujacollection');

  const isPassMatch = timingSafeStringCompare(pass, ADMIN_PASSWORD);

  return isEmailMatch && isPassMatch;
}

export function createSessionToken(): string {
  const payload = {
    role: 'STORE_OWNER',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(data)
    .digest('hex');

  return `${data}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [data, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(data)
    .digest('hex');

  if (!timingSafeStringCompare(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    if (Date.now() > payload.expiresAt) return false;
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
