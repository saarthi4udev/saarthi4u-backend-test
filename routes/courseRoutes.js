const express = require("express");
const { body, param } = require("express-validator");
const {
  createCourse,
  getCoursesByCollege,
  deleteCourse,
} = require("../controllers/courseController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Course */
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
    body("name")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Course name must be at least 2 characters long"),
    body("specialization")
      .optional()
      .isString()
      .withMessage("Specialization must be a string"),
    body("duration")
      .optional()
      .isString()
      .withMessage("Duration must be a string"),
    body("totalSeats")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Total seats must be a positive integer"),
    body("level")
      .optional()
      .isIn(["UG", "PG", "Diploma", "PhD"])
      .withMessage("Level must be one of 'UG', 'PG', 'Diploma', or 'PhD'"),
  ],
  createCourse
);

/** Get Courses by College */
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
  getCoursesByCollege
);

/** Delete Course */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Course ID must be an integer")
      .notEmpty()
      .withMessage("Course ID is required"),
  ],
  deleteCourse
);

module.exports = router;
