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

/** Create Cutoff */
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

    body("courseName")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Course name must be at least 2 characters long"),

    body("exam")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Exam name must be at least 2 characters long"),

    body("year")
      .isInt({ min: 2000, max: new Date().getFullYear() })
      .withMessage(`Year must be between 2000 and ${new Date().getFullYear()}`),

    body("closingRank")
      .isString()
      .notEmpty()
      .withMessage("Closing rank is required"),
  ],
  createCutoff
);

/** Get Cutoffs by College */
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
  getCutoffsByCollege
);

/** Delete Cutoff */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Cutoff ID must be an integer")
      .notEmpty()
      .withMessage("Cutoff ID is required"),
  ],
  deleteCutoff
);

module.exports = router;
