type RateLimitState = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 5000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-vercel-forwarded-for') ||
    'unknown'
  );
}

export function rateLimit(key: string, limit = 30, windowMs = 60_000): RateLimitState {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets.entries()) {
      if (now > v.resetAt) buckets.delete(k);
      if (buckets.size <= MAX_BUCKETS) break;
    }
  }

  const existing = buckets.get(key);
  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, limit, remaining: Math.max(0, limit - 1), resetAt };
  }

  if (existing.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { ok: false, limit, remaining: 0, resetAt: existing.resetAt, retryAfter };
  }

  existing.count += 1;
  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt
  };
}

export function buildRateLimitHeaders(state: RateLimitState): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(state.limit),
    'X-RateLimit-Remaining': String(state.remaining),
    'X-RateLimit-Reset': String(Math.ceil(state.resetAt / 1000))
  };
  if (state.retryAfter) {
    headers['Retry-After'] = String(state.retryAfter);
  }
  return headers;
}

// World of Tethys || D.C. Barletta
