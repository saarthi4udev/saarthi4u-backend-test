const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createExam,
    getAllExams,
    getExamByIdOrSlug,
    updateExam,
    deleteExam,
} = require("../controllers/examController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Exam */
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

        body("fullName")
            .optional()
            .isString()
            .withMessage("Full name must be a string"),

        body("categoryId")
            .isInt()
            .withMessage("Category ID must be an integer"),

        body("level")
            .isIn(["national", "state", "university", "international"])
            .withMessage("Invalid level"),

        body("examMode")
            .isIn(["online", "offline", "hybrid"])
            .withMessage("Invalid exam mode"),

        body("examType")
            .isIn(["entrance", "eligibility", "scholarship"])
            .withMessage("Invalid exam type"),

        body("conductingBody")
            .isString()
            .notEmpty()
            .withMessage("Conducting body is required"),

        body("frequency")
            .optional()
            .isString()
            .withMessage("Frequency must be a string"),

        body("duration")
            .optional()
            .isString()
            .withMessage("Duration must be a string"),

        body("totalMarks")
            .optional()
            .isInt({ min: 0 })
            .withMessage("Total marks must be a positive integer"),

        body("applicationFee")
            .optional()
            .isString()
            .withMessage("Application fee must be a string"),

        body("officialWebsite")
            .optional()
            .isURL()
            .withMessage("Official website must be a valid URL"),

        body("overview").optional().isString(),
        body("eligibility").optional().isString(),
        body("examPattern").optional().isString(),
        body("syllabus").optional().isString(),
        body("applicationProcess").optional().isString(),
        body("admitCardDetails").optional().isString(),
        body("resultDetails").optional().isString(),
        body("cutoffDetails").optional().isString(),
        body("counsellingDetails").optional().isString(),

        body("importantDates")
            .optional()
            .isObject()
            .withMessage("Important dates must be a JSON object"),

        body("metaTitle").optional().isString(),
        body("metaKeywords").optional().isString(),
        body("metaDescription").optional().isString(),

        body("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be a boolean"),
    ],
    createExam
);

/** Get all Exams */
router.get(
    "/all",
    [
        query("page")
            .optional()
            .isInt()
            .withMessage("Page must be an integer"),

        query("limit")
            .optional()
            .isInt()
            .withMessage("Limit must be an integer"),

        query("search")
            .optional()
            .isString()
            .withMessage("Search must be a string"),

        query("level")
            .optional()
            .isIn(["national", "state", "university", "international"])
            .withMessage("Invalid level"),

        query("examMode")
            .optional()
            .isIn(["online", "offline", "hybrid"])
            .withMessage("Invalid exam mode"),

        query("examType")
            .optional()
            .isIn(["entrance", "eligibility", "scholarship"])
            .withMessage("Invalid exam type"),

        query("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),
    ],
    loggerMiddleware,
    getAllExams
);

/** Get single Exam */
router.get(
    "/exam/:identifier",
    loggerMiddleware,
    [
        param("identifier")
            .notEmpty()
            .withMessage("ID or Slug is required"),
    ],
    getExamByIdOrSlug
);

/** Update Exam */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("ID must be an integer"),
    ],
    updateExam
);

/** Delete Exam */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isInt()
            .withMessage("ID must be an integer"),
    ],
    deleteExam
);

module.exports = router;