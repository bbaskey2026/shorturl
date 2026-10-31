// response.js - Standard API Response Envelope

const success = (res, data, statusCode = 200, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
    error: null,
  });
};

const error = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
      details,
    },
  });
};

module.exports = {
  success,
  error,
};

