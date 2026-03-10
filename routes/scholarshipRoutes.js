const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createScholarship,
    getAllScholarships,
    getScholarshipByIdOrSlug,
    updateScholarship,
    deleteScholarship,
} = require("../controllers/scholarshipController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Scholarship */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("name")
            .isString()
            .isLength({ min: 3, max: 255 })
            .withMessage("Name must be 3-255 characters long"),

        body("slug")
            .isString()
            .notEmpty()
            .withMessage("Slug must be a non-empty string"),

        body("shortName")
            .optional()
            .isString()
            .isLength({ min: 2, max: 50 })
            .withMessage("Short name must be 2-50 characters"),

        body("categoryId")
            .isInt()
            .withMessage("Category ID must be an integer"),

        body("provider")
            .isString()
            .notEmpty()
            .withMessage("Provider is required"),

        body("scholarshipType")
            .isIn(["government", "private", "international", "university"])
            .withMessage("Invalid scholarship type"),

        body("level")
            .isIn(["school", "ug", "pg", "phd"])
            .withMessage("Invalid level"),

        body("amount")
            .optional()
            .isString()
            .withMessage("Amount must be a string"),

        body("applicationMode")
            .optional()
            .isIn(["online", "offline"])
            .withMessage("Invalid application mode"),

        body("officialWebsite")
            .optional()
            .isURL()
            .withMessage("Official website must be valid URL"),

        body("overview").optional().isString(),
        body("eligibility").optional().isString(),
        body("benefits").optional().isString(),
        body("applicationProcess").optional().isString(),
        body("documentsRequired").optional().isString(),
        body("selectionProcess").optional().isString(),
        body("renewalProcess").optional().isString(),

        body("importantDates")
            .optional()
            .isObject()
            .withMessage("Important dates must be JSON object"),

        body("metaTitle").optional().isString(),
        body("metaKeywords").optional().isString(),
        body("metaDescription").optional().isString(),

        body("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),
    ],
    createScholarship
);

/** Get all Scholarships */
router.get(
    "/all",
    [
        query("page")
            .optional()
            .isInt()
            .withMessage("Page must be integer"),

        query("limit")
            .optional()
            .isInt()
            .withMessage("Limit must be integer"),

        query("search")
            .optional()
            .isString()
            .withMessage("Search must be string"),

        query("level")
            .optional()
            .isIn(["school", "ug", "pg", "phd"])
            .withMessage("Invalid level"),

        query("scholarshipType")
            .optional()
            .isIn(["government", "private", "international", "university"])
            .withMessage("Invalid scholarship type"),

        query("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),
    ],
    loggerMiddleware,
    getAllScholarships
);

/** Get single Scholarship */
router.get(
    "/scholarship/:identifier",
    loggerMiddleware,
    [
        param("identifier")
            .notEmpty()
            .withMessage("ID or Slug is required"),
    ],
    getScholarshipByIdOrSlug
);

/** Update Scholarship */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("ID must be integer"),
    ],
    updateScholarship
);

/** Delete Scholarship */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("ID must be integer"),
    ],
    deleteScholarship
);

module.exports = router;