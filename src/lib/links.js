function trimSlash(value = '') {
  return value.replace(/^\//, '');
}

export function getAmazonBookUrl() {
  return process.env.AMAZON_BOOK_URL || '';
}

export function getMediaUrl(path = '') {
  const base = process.env.MEDIA_BASE_URL || '';
  if (!base) return '';
  return `${base.replace(/\/$/, '')}/${trimSlash(path)}`;
}
