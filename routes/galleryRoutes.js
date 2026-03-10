const express = require("express");
const { body, param } = require("express-validator");
const {
    createGalleryItem,
    getGalleryByCollege,
    deleteGalleryItem,
} = require("../controllers/galleryController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Gallery Item */
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

        body("imageUrl")
            .isString()
            .isLength({ min: 5 })
            .withMessage("Image URL must be a valid string"),

        body("caption")
            .optional()
            .isString()
            .withMessage("Caption must be a string"),
    ],
    createGalleryItem
);

/** Get Gallery by College */
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
    getGalleryByCollege
);

/** Delete Gallery Item */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("Gallery ID must be an integer")
            .notEmpty()
            .withMessage("Gallery ID is required"),
    ],
    deleteGalleryItem
);

module.exports = router;
