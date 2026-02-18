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

router.post("/create", verifyToken, loggerMiddleware, createFaculty);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getFacultyByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteFaculty
);

module.exports = router;
