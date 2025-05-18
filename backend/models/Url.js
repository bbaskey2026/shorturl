const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date, // Optional expiration
  clicks: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
