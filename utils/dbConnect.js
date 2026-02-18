const sequelize = require("../config/database");;
const logger = require("../config/logger");

// Database connection with retry logic (Enhanced for licensing)
const connectDB = async () => {
  try {
    // SQL Database Connection
    await sequelize.authenticate();
    logger.info("✅ SQL Database connection established");

    await sequelize.sync({ alter: false });
    logger.info("✅ SQL Database synchronized successfully");

    return true;
  } catch (err) {
    logger.error("❌ Database connection error:", err);
    logger.info("🔄 Retrying database connection in 5 seconds...");
    setTimeout(connectDB, 5000);
    return false;
  }
};

module.exports = connectDB;
