// cookie.middleware.js - Lightweight, Zero-Dependency Cookie Parsing & Setting
const cookieParser = (req, res, next) => {
  // Parse incoming cookies
  req.cookies = req.cookies || {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
      const idx = pair.indexOf('=');
      if (idx !== -1) {
        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        try {
          req.cookies[key] = decodeURIComponent(val);
        } catch {
          req.cookies[key] = val;
        }
      }
    }
  }

  // Helper method to set a cookie header
  res.setCookie = (name, value, options = {}) => {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.maxAge) {
      cookieStr += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
      cookieStr += `; Expires=${new Date(Date.now() + options.maxAge).toUTCString()}`;
    } else if (options.expires) {
      cookieStr += `; Expires=${options.expires.toUTCString()}`;
    }

    if (options.httpOnly) {
      cookieStr += '; HttpOnly';
    }

    if (options.secure) {
      cookieStr += '; Secure';
    }

    if (options.sameSite) {
      const sameSite = options.sameSite === true ? 'Strict' : options.sameSite;
      cookieStr += `; SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`;
    }

    cookieStr += `; Path=${options.path || '/'}`;

    const prev = res.getHeader('Set-Cookie');
    if (prev) {
      const arr = Array.isArray(prev) ? prev : [prev];
      res.setHeader('Set-Cookie', [...arr, cookieStr]);
    } else {
      res.setHeader('Set-Cookie', cookieStr);
    }
  };

  // Helper to clear a cookie
  res.clearCookie = (name, options = {}) => {
    res.setCookie(name, '', {
      ...options,
      maxAge: 0,
      expires: new Date(0),
    });
  };

  next();
};

module.exports = { cookieParser };

