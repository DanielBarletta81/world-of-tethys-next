export async function bffFetch(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'include'
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    const error = new Error(json.error || res.statusText || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return res.json();
}
