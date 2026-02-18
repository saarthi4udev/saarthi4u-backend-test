const logger = require('../config/logger');
const { notAuthorziedCode } = require('../config/statuscodes');

// Improved monitoring middleware for suspicious activity
const securityMiddleware = (req, res, next) => {
  // Skip security check during development if needed
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_SECURITY_CHECK === 'true') {
    return next();
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /etc\/passwd/i,
    /\/proc\//i,
    /..\//,  // Directory traversal attempts
    /\bselect\s+.*\bfrom\b/i, // More specific SQL injection pattern
    /<script\b/i // More specific XSS pattern
  ];

  const reqUrl = req.url;
  // Only stringify the body if it exists and is an object
  const reqBody = req.body ? JSON.stringify(req.body) : '';

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(reqUrl) || pattern.test(reqBody)) {
      logger.warn({
        message: 'Suspicious request detected',
        ip: req.ip,
        url: req.url,
        method: req.method,
        pattern: pattern.toString()
      });

      // In development, log the actual content that triggered the pattern
      if (process.env.NODE_ENV === 'development') {
        logger.debug({
          body: req.body,
          url: req.url,
          matchedPattern: pattern.toString()
        });
      }

      return res.status(notAuthorziedCode).json({ error: 'Request blocked for security reasons' });
    }
  }
  next();
};

module.exports = securityMiddleware;