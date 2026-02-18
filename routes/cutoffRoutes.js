const express = require("express");
const { body, param } = require("express-validator");
const {
  createCutoff,
  getCutoffsByCollege,
  deleteCutoff,
} = require("../controllers/cutoffController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

router.post("/create", verifyToken, loggerMiddleware, createCutoff);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getCutoffsByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteCutoff
);

module.exports = router;
