/**
 * Fixed-window rate limiter held in memory.
 *
 * Limits: this state lives in one server process. On serverless hosting each
 * instance has its own counter, so this slows casual abuse but is not a hard
 * guarantee. For stronger protection use a shared store or the host's
 * firewall (see docs/DEPLOYMENT.md).
 */
export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the key may try again (0 when allowed). */
  retryAfterSeconds: number;
}

export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 5000,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  function sweep(time: number) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= time) hits.delete(key);
    }
  }

  return {
    check(key: string): RateLimitResult {
      const time = now();
      if (hits.size >= maxKeys) sweep(time);

      const entry = hits.get(key);
      if (!entry || entry.resetAt <= time) {
        hits.set(key, { count: 1, resetAt: time + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }
      if (entry.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil((entry.resetAt - time) / 1000),
        };
      }
      entry.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
