const express = require("express");
const { body, param } = require("express-validator");
const {
  createFacility,
  getFacilitiesByCollege,
  deleteFacility,
} = require("../controllers/facilityController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Facility */
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
      .withMessage("Facility name must be 2–150 characters long"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ],
  createFacility
);

/** Get Facilities by College */
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
  getFacilitiesByCollege
);

/** Delete Facility */
router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id")
      .isInt()
      .withMessage("Facility ID must be an integer")
      .notEmpty()
      .withMessage("Facility ID is required"),
  ],
  deleteFacility
);

module.exports = router;
