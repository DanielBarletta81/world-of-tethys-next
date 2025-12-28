import fetch from 'cross-fetch';

let cachedToken = null;
let cachedExpiry = 0;

function getEnv(key, fallback = '') {
  if (!process.env[key] && fallback === undefined) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return process.env[key] || fallback;
}

function isExpired() {
  return !cachedToken || Date.now() >= cachedExpiry;
}

export async function getAccessToken() {
  if (!isExpired()) {
    return cachedToken;
  }

  const tokenUrl = getEnv('OAUTH_TOKEN_URL');
  const clientId = getEnv('OAUTH_CLIENT_ID');
  const clientSecret = getEnv('OAUTH_CLIENT_SECRET');
  const audience = process.env.OAUTH_AUDIENCE;
  const scope = process.env.OAUTH_SCOPE || '';
  const grantType = process.env.OAUTH_GRANT_TYPE || 'client_credentials';

  const body = new URLSearchParams({
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret
  });

  if (audience) body.append('audience', audience);
  if (scope) body.append('scope', scope);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${res.status} ${res.statusText} – ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  const expiresInMs = (data.expires_in || 300) * 1000;
  cachedExpiry = Date.now() + expiresInMs - 30_000; // refresh 30s early
  return cachedToken;
}
