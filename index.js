require("dotenv").config();
const app = require("./app");
const connectDB = require("./utils/dbConnect");
const logger = require("./config/logger");

// Connect to database before starting server
const startServer = async () => {
  // Try to connect to database
  await connectDB();

  // Start server with graceful shutdown
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! Shutting down...", err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM
  process.on("SIGTERM", () => {
    logger.info("SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated!");
    });
  });
};

startServer();
