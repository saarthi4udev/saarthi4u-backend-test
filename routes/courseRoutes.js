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

router.post(
  "/create",
  verifyToken,
  loggerMiddleware,
  [
    body("name").isString(),
    body("collegeId").isInt(),
    body("duration").optional().isString(),
  ],
  createCourse
);

router.get(
  "/college/:collegeId",
  loggerMiddleware,
  [param("collegeId").isInt()],
  getCoursesByCollege
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteCourse
);

module.exports = router;
