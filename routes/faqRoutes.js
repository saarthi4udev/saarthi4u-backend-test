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

/** Create FAQ */
router.post(
  "/create",
  verifyToken,
  loggerMiddleware,
  [
    body("collegeId")
      .isInt()
      .withMessage("College ID must be an integer")
      .notEmpty()
      .withMessage("College ID is required"),

    body("question")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Question must be at least 5 characters long"),

    body("answer")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Answer must be at least 5 characters long"),
  ],
  createFAQ
);

/** Get FAQs by College */
router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [
    param("collegeId")
      .isInt()
      .withMessage("College ID must be an integer")
      .notEmpty()
      .withMessage("College ID is required"),
  ],
  getFAQsByCollege
);

/** Delete FAQ */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("FAQ ID must be an integer")
      .notEmpty()
      .withMessage("FAQ ID is required"),
  ],
  deleteFAQ
);

module.exports = router;
