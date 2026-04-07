function isLikelyIp(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function resolveCookieDomain() {
  const explicit = process.env.AUTH_COOKIE_DOMAIN?.trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV !== 'production') return undefined;

  const candidateUrl =
    process.env.NEXT_PUBLIC_WORLD_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    '';
  if (!candidateUrl) return undefined;

  try {
    const hostname = new URL(candidateUrl).hostname.toLowerCase();
    if (!hostname || hostname === 'localhost' || isLikelyIp(hostname)) return undefined;
    const root = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    return `.${root}`;
  } catch {
    return undefined;
  }
}

export function getSessionCookieOptions(maxAge: number) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge
  };

  const domain = resolveCookieDomain();
  if (!domain) return options;
  return { ...options, domain };
}
