/**
 * Minimal in-memory rate limiter. Good enough for a single-instance demo;
 * swap for Upstash Redis / Vercel KV in multi-instance production setups.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP extraction behind Vercel / common proxies. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
