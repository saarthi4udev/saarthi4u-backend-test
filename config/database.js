const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For self-signed certificates
      },
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to Database successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop app if DB is not reachable
  });

module.exports = sequelize;
