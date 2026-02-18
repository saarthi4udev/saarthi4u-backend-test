const express = require("express");
const logger = require("./config/logger");
const configExpress = require("./config/express");
const registerRoutes = require("./routes");
const errorHandler = require("./middlewares/errorMiddleware");
const memoryMonitor = require('./utils/memoryMonitor');

// Create Express app
const app = express();

// Start memory monitoring
memoryMonitor.startMonitoring(30000); // Every 30 seconds

// Add middleware to track memory per request
app.use(memoryMonitor.middleware());

// Load associations
require("./associations");

// Configure Express app with middleware
configExpress(app);

// Register all routes
registerRoutes(app);

// Apply error handler - must be after all routes
app.use(errorHandler);

module.exports = app;