const express = require("express");
const { body, param } = require("express-validator");
const {
    createReview,
    getReviewsByCollege,
    deleteReview,
} = require("../controllers/reviewController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

router.post(
    "/create",
    loggerMiddleware,
    [
        body("collegeId").isInt(),
        body("rating").isFloat({ min: 1, max: 5 }),
    ],
    createReview
);

router.get(
    "/college/:collegeId",
    loggerMiddleware,
    [param("collegeId").isInt()],
    getReviewsByCollege
);

router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    deleteReview
);

module.exports = router;
