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

router.post("/create", verifyToken, loggerMiddleware, createFacility);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getFacilitiesByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteFacility
);

module.exports = router;
