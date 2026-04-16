const express = require("express");
const { body, param } = require("express-validator");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const multer = require("multer");
const { createSection, getSection, updateSection } = require("../controllers/homeSectionController");

const upload = multer({ dest: "uploads/temp/" });
const router = express.Router();

/** Create Section */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    upload.single("imageUrl"),
    [
        body("header").notEmpty().withMessage("Header is required"),
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
    ],
    createSection
);

/** Update Section */
router.put(
    "/update",
    verifyToken,
    loggerMiddleware,
    upload.single("imageUrl"),
    [
        body("header").optional(),
        body("title").optional(),
        body("description").optional(),
        body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
    ],
    updateSection
);

/** Get All Sections (Public) */
router.get("/all", loggerMiddleware,
    getSection);



module.exports = router;