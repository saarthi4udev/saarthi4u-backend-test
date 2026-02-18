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

router.post(
  "/create",
  verifyToken,
  loggerMiddleware,
  [
    body("courseId").isInt(),
    body("year").isString(),
    body("tuitionFee").optional().isInt(),
  ],
  createFee
);

router.get(
  "/course/:courseId",
  loggerMiddleware,
  [param("courseId").isInt()],
  getFeesByCourse
);

router.delete(
  "/delete/:id",
  verifyToken,
  loggerMiddleware,
  [param("id").isInt()],
  deleteFee
);

module.exports = router;
