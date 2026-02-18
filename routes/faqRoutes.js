const express = require("express");
const { body, param } = require("express-validator");
const {
  createFAQ,
  getFAQsByCollege,
  deleteFAQ,
} = require("../controllers/faqController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

router.post("/create", verifyToken, loggerMiddleware, createFAQ);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getFAQsByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteFAQ
);

module.exports = router;
