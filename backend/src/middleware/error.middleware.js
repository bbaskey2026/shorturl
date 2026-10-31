// error.middleware.js - Centralized Express error handler
const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = {
  errorHandler,
};

