require("dotenv").config();

const app = require("../app");
const connectDB = require("../utils/dbConnect");

let isConnected = false;

const index = async (req, res) => {
  if (!isConnected) {
    await connectDB(); // connect once
    isConnected = true;
  }
  return app(req, res);
};
module.exports = index;
