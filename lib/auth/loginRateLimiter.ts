// In-memory rate limiting and lockout store for Admin Authentication
interface RateLimitEntry {
  failedAttempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const loginRateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginRateLimitStore.get(identifier);

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if currently locked out
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // If window expired and not locked, reset entry
  if (now - entry.firstAttemptAt > WINDOW_DURATION_MS && !entry.lockedUntil) {
    loginRateLimitStore.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts);
  return {
    allowed: entry.failedAttempts < MAX_FAILED_ATTEMPTS,
    remainingAttempts: remaining,
  };
}

export function recordFailedLogin(identifier: string): {
  remainingAttempts: number;
  isLocked: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginRateLimitStore.get(identifier) || {
    failedAttempts: 0,
    firstAttemptAt: now,
  };

  // If previous window has passed, reset start time
  if (now - entry.firstAttemptAt > WINDOW_DURATION_MS && !entry.lockedUntil) {
    entry.failedAttempts = 0;
    entry.firstAttemptAt = now;
    entry.lockedUntil = undefined;
  }

  entry.failedAttempts += 1;

  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginRateLimitStore.set(identifier, entry);
    return {
      remainingAttempts: 0,
      isLocked: true,
      retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginRateLimitStore.set(identifier, entry);
  return {
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts),
    isLocked: false,
  };
}

export function recordSuccessfulLogin(identifier: string): void {
  loginRateLimitStore.delete(identifier);
}
