const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const slowDown = require("express-slow-down");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("node:path");

const logger = require("./logger");
const { globalLimiter } = require("../middlewares/rateLimiterMiddleware");
const securityMiddleware = require("../middlewares/securityMiddleware");

const express_ = (app) => {
  /* -------------------- SECURITY HEADERS -------------------- */
  app.use(helmet());

  /* -------------------- RATE LIMITING -------------------- */
  app.use(globalLimiter);

  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 min
    delayAfter: 500,
    delayMs: (hits) => hits * 100,
  });
  app.use(speedLimiter);

  /* -------------------- CORS (SINGLE SOURCE OF TRUTH) -------------------- */
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : [];

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // allow preview deployments
      ) {
        return callback(null, true);
      }

      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  };


  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  /* -------------------- BODY PARSERS -------------------- */
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  /* -------------------- PREVENT PARAM POLLUTION -------------------- */
  app.use(hpp());

  /* -------------------- COMPRESSION -------------------- */
  app.use(compression());

  /* -------------------- LOGGING -------------------- */
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  /* -------------------- STATIC FILES -------------------- */
  app.use(
    "/uploads",
    cors(corsOptions),
    express.static(path.join(__dirname, "../uploads"), {
      maxAge: "1d",
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    })
  );

  /* -------------------- EXTRA SECURITY CHECKS -------------------- */
  app.use(securityMiddleware);

  /* -------------------- ERROR RESPONSE LOGGER -------------------- */
  app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
      if (res.statusCode >= 400) {
        logger.warn({
          statusCode: res.statusCode,
          path: req.path,
          method: req.method,
          responseBody:
            typeof body === "string" ? body : JSON.stringify(body),
          ip: req.ip,
        });
      }
      return originalSend.call(this, body);
    };

    next();
  });

  return app;
};
module.exports = express_;
