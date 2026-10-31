// rateLimiter.middleware.js - In-memory sliding window rate limiter
const { error } = require('../utils/response');

const requestCounts = new Map();

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 300000);

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60000; // 1 min
  const max = options.max || 120; // 120 requests per min
  const message = options.message || 'Too many requests, please try again later.';

  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'global';
    const now = Date.now();

    let record = requestCounts.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      requestCounts.set(key, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return error(res, message, 429);
    }

    next();
  };
};

module.exports = {
  rateLimiter,
};

