const rateLimit = require("express-rate-limit");

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000, // 2000 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after an hour'
});

// Auth routes limiter
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // 200 requests per hour
  message: 'Too many login attempts, please try again after an hour'
});

// Admin routes limiter
const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: 'Too many admin requests, please try again after an hour'
});

module.exports = {
  globalLimiter,
  authLimiter,
  adminLimiter
};