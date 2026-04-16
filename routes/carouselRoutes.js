const express = require("express");
const { body, param } = require("express-validator");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const multer = require("multer");
const { createCarousel, getAllCarousel, deleteCarousel } = require("../controllers/carouselController");

const upload = multer({ dest: "uploads/temp/" });
const router = express.Router();

/** Create Carousel */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    upload.single("imageUrl"),
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").optional(),
        body("rank").isInt({ min: 1 }).withMessage("Rank must be a positive integer"),
    ],
    createCarousel
);

/** Get All Carousels (Public) */
router.get("/all", loggerMiddleware,
    getAllCarousel);


/** Delete Carousel */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isUUID()],
    deleteCarousel
);

module.exports = router;