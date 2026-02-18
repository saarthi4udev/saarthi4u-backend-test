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

router.post(
  "/create",
  verifyToken,
  loggerMiddleware,
  [body("collegeId").isInt()],
  createAdmission
);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getAdmissionsByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteAdmission
);

module.exports = router;
