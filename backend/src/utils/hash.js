// hash.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};

// Privacy-preserving visitor fingerprinting for unique visitor tracking
const hashVisitor = (ip, userAgent, salt = 'shorturl_salt_2026') => {
  const dateStr = new Date().toISOString().slice(0, 10); // Daily uniqueness bucket
  return crypto
    .createHash('sha256')
    .update(`${ip || '0.0.0.0'}-${userAgent || 'unknown'}-${salt}-${dateStr}`)
    .digest('hex');
};

module.exports = {
  hashPassword,
  comparePassword,
  hashVisitor,
};

