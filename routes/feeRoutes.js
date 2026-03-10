const express = require("express");
const { body, param } = require("express-validator");
const {
  createFee,
  getFeesByCourse,
  deleteFee,
} = require("../controllers/feeController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Fee */
router.post(
  "/create",
  verifyToken,
  loggerMiddleware,
  [
    body("courseId")
      .isInt()
      .withMessage("Course ID must be an integer")
      .notEmpty()
      .withMessage("Course ID is required"),

    body("year")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Year must be a valid string (e.g., '1st Year')"),

    body("tuitionFee")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Tuition fee must be a positive integer"),

    body("hostelFee")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Hostel fee must be a positive integer"),

    body("examFee")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Exam fee must be a positive integer"),

    body("otherFee")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Other fee must be a positive integer"),

    body("totalFee")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Total fee must be a positive integer"),
  ],
  createFee
);

/** Get Fees by Course */
router.get(
  "/course/:courseId",
  loggerMiddleware,
  [
    param("courseId")
      .isInt()
      .withMessage("Course ID must be an integer")
      .notEmpty()
      .withMessage("Course ID is required"),
  ],
  getFeesByCourse
);

/** Delete Fee */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Fee ID must be an integer")
      .notEmpty()
      .withMessage("Fee ID is required"),
  ],
  deleteFee
);

module.exports = router;
