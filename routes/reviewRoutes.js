const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createReview,
  getReviewsByCollege,
  deleteReview,
} = require("../controllers/reviewController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/* 🔹 Validation Handler */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};



// ===================================
// 🔹 Create Review
// ===================================
router.post(
  "/create",
  loggerMiddleware,
  [
    body("collegeId")
      .notEmpty().withMessage("collegeId is required")
      .isInt().withMessage("collegeId must be an integer"),

    body("userName")
      .notEmpty().withMessage("User name is required")
      .isString().withMessage("userName must be a string")
      .isLength({ min: 2, max: 100 })
      .withMessage("userName must be 2–100 characters"),

    body("rating")
      .notEmpty().withMessage("Rating is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),

    body("comment")
      .optional()
      .isString().withMessage("Comment must be text")
      .isLength({ max: 1000 })
      .withMessage("Comment cannot exceed 1000 characters"),
  ],
  validate,
  createReview
);



// ===================================
// 🔹 Get Reviews by College
// ===================================
router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [
    param("collegeId")
      .notEmpty().withMessage("collegeId param is required")
      .isInt().withMessage("collegeId must be an integer"),
  ],
  validate,
  getReviewsByCollege
);



// ===================================
// 🔹 Delete Review
// ===================================
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .notEmpty().withMessage("Review ID is required")
      .isInt().withMessage("ID must be an integer"),
  ],
  validate,
  deleteReview
);

module.exports = router;
