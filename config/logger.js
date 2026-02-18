const winston = require("winston");

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'saarthi4u-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// Add a response logging method
logger.logResponse = (req, res, body) => {
  if (res.statusCode >= 400) {
    logger.warn({
      statusCode: res.statusCode,
      path: req.path,
      method: req.method,
      responseBody: typeof body === 'string' ? body : JSON.stringify(body),
      ip: req.ip
    });
  } else if (process.env.LOG_ALL_RESPONSES === 'true') {
    // Optionally log successful responses too
    logger.debug({
      statusCode: res.statusCode,
      path: req.path,
      method: req.method,
      responseBody: typeof body === 'string' ? body : JSON.stringify(body)
    });
  }
};

module.exports = logger;