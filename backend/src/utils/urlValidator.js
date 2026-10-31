// urlValidator.js - Security against SSRF, open redirect abuse & malicious protocols

const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS metadata endpoint
  'metadata.google.internal',
];

const isValidUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Protocol must be http: or https:' };
    }

    // SSRF Prevention: Disallow internal addresses
    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.includes(host) || host.endsWith('.local') || host.endsWith('.internal')) {
      return { valid: false, reason: 'Internal or restricted hostnames are not permitted' };
    }

    // Disallow private IP subnets
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host)) {
      return { valid: false, reason: 'Private IP ranges are forbidden' };
    }

    return { valid: true, url: parsed.toString() };
  } catch (err) {
    return { valid: false, reason: 'Invalid URL syntax' };
  }
};

const isValidSlug = (slug) => {
  if (!slug) return true; // optional
  const regex = /^[a-zA-Z0-9_-]{2,64}$/;
  return regex.test(slug);
};

module.exports = {
  isValidUrl,
  isValidSlug,
};

