const express = require("express");
const { body, param } = require("express-validator");
const {
  createAdmission,
  getAdmissionsByCollege,
  deleteAdmission,
} = require("../controllers/admissionController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Admission */
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
    body("process")
      .optional()
      .isString()
      .withMessage("Process must be a string"),
    body("eligibility")
      .optional()
      .isString()
      .withMessage("Eligibility must be a string"),
    body("entranceExams")
      .optional()
      .isString()
      .withMessage("Entrance exams must be a string"),
    body("importantDates")
      .optional()
      .custom((value) => {
        if (typeof value !== "object") {
          throw new TypeError("Important dates must be a JSON object");
        }
        return true;
      }),
  ],
  createAdmission
);

/** Get Admissions by College */
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
  getAdmissionsByCollege
);

/** Delete Admission */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Admission ID must be an integer")
      .notEmpty()
      .withMessage("Admission ID is required"),
  ],
  deleteAdmission
);

module.exports = router;
