const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    deleteTestimonial,
} = require("../controllers/testimonialController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/temp/" });
const router = express.Router();

/** Create Testimonial */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    upload.single("avatarUrl"),
    [
        body("quote").isString().isLength({ min: 5 }),
        body("name").isString().isLength({ min: 2 }),
        body("role").isString().isLength({ min: 2 }),
        body("city").isString().isLength({ min: 2 }),
        body("rating").isInt({ min: 1, max: 5 }),
    ],
    createTestimonial
);

/** Get All Testimonials (Public) */
router.get("/all", loggerMiddleware,
    [
        query("page").optional().isInt({ min: 1 }),
        query("limit").optional().isInt({ min: 1, max: 100 }),
    ],
    getAllTestimonials);

/** Get Single Testimonial */
router.get(
    "/testimonial/:id",
    loggerMiddleware,
    [param("id").isUUID()],
    getTestimonialById
);

/** Delete Testimonial */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isUUID()],
    deleteTestimonial
);

module.exports = router;