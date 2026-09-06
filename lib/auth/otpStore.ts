import crypto from 'crypto';

interface OtpEntry {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

// In-memory OTP store: target (email or phone) -> OtpEntry
const otpStore = new Map<string, OtpEntry>();

// In-memory verification token store: token -> { target: string, expiresAt: number }
const verifiedTokenStore = new Map<string, { target: string; expiresAt: number }>();

const OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes
const VERIFIED_TOKEN_VALIDITY_MS = 15 * 60 * 1000; // 15 minutes
const MAX_VERIFY_ATTEMPTS = 5;

// In-memory rate limiting store: target -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

function normalizeTarget(target: string): string {
  if (!target) return '';
  return target.trim().toLowerCase();
}

export function checkRateLimit(target: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const cleanTarget = normalizeTarget(target);
  const timestamps = rateLimitMap.get(cleanTarget) || [];

  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(cleanTarget, activeTimestamps);
  return { limited: false };
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

export function generateAndStoreOtp(target: string): string {
  const cleanTarget = normalizeTarget(target);
  // Cryptographically random 6-digit numeric OTP
  const randomNum = crypto.randomInt(100000, 999999).toString();
  const codeHash = hashCode(randomNum);

  otpStore.set(cleanTarget, {
    codeHash,
    expiresAt: Date.now() + OTP_VALIDITY_MS,
    attempts: 0,
  });

  return randomNum;
}

export function verifyOtpCode(target: string, inputCode: string): { valid: boolean; message: string; verificationToken?: string } {
  const cleanTarget = normalizeTarget(target);
  const entry = otpStore.get(cleanTarget);

  if (!entry) {
    return { valid: false, message: 'No active verification code found for this address. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanTarget);
    return { valid: false, message: 'Verification code has expired. Please request a new code.' };
  }

  if (entry.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(cleanTarget);
    return { valid: false, message: 'Too many incorrect attempts. Please request a fresh verification code.' };
  }

  entry.attempts += 1;

  const inputHash = hashCode(inputCode);
  if (inputHash !== entry.codeHash) {
    return { valid: false, message: 'Incorrect verification code. Please check your inbox and try again.' };
  }

  // Code is valid! Consume it
  otpStore.delete(cleanTarget);

  // Generate a cryptographically random verification token for order submission
  const verificationToken = `otp_verified_${crypto.randomBytes(16).toString('hex')}`;
  verifiedTokenStore.set(verificationToken, {
    target: cleanTarget,
    expiresAt: Date.now() + VERIFIED_TOKEN_VALIDITY_MS,
  });

  return {
    valid: true,
    message: 'Email address verified successfully.',
    verificationToken,
  };
}

export function isPhoneVerifiedTokenValid(token: string | undefined, target: string): boolean {
  if (!token) return false;
  const entry = verifiedTokenStore.get(token);
  if (!entry) return false;

  const cleanTarget = normalizeTarget(target);
  if (Date.now() > entry.expiresAt || entry.target !== cleanTarget) {
    verifiedTokenStore.delete(token);
    return false;
  }

  return true;
}
