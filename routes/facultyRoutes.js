const express = require("express");
const { body, param } = require("express-validator");
const {
  createFaculty,
  getFacultyByCollege,
  deleteFaculty,
} = require("../controllers/facultyController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Faculty */
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
      .isLength({ min: 2, max: 150 })
      .withMessage("Faculty name must be 2–150 characters long"),

    body("designation")
      .optional()
      .isString()
      .withMessage("Designation must be a string"),

    body("qualification")
      .optional()
      .isString()
      .withMessage("Qualification must be a string"),

    body("experience")
      .optional()
      .isString()
      .withMessage("Experience must be a string"),
  ],
  createFaculty
);

/** Get Faculty by College */
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
  getFacultyByCollege
);

/** Delete Faculty */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Faculty ID must be an integer")
      .notEmpty()
      .withMessage("Faculty ID is required"),
  ],
  deleteFaculty
);

module.exports = router;
