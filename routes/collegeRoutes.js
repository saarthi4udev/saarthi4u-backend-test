const express = require("express");
const { body, param, query } = require("express-validator");
const {
    createCollege,
    getColleges,
    getCollegeByIdOrSlug,
    updateCollege,
    deleteCollege,
    getFilterData,
    filterColleges,
    compareColleges,
} = require("../controllers/collegeController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create College */
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
            .withMessage("Short name should be 2-50 characters"),
        body("logo")
            .optional()
            .isString()
            .withMessage("College logo URL must be string"),
        body("bannerImg")
            .optional()
            .isString()
            .withMessage("Banner Image must be string"),
        body("categoryId")
            .isInt()
            .withMessage("Category ID must be an integer"),
        body("type")
            .isIn(["college", "university"])
            .withMessage("Type must be either 'college' or 'university'"),
        body("establishedYear")
            .optional()
            .isInt({ min: 1800, max: new Date().getFullYear() })
            .withMessage(`Established year must be between 1800 and ${new Date().getFullYear()}`),
        body("affiliation")
            .optional()
            .isString()
            .withMessage("Affiliation must be a string"),
        body("approvedBy")
            .optional()
            .isString()
            .withMessage("ApprovedBy must be a string"),
        body("accreditation")
            .optional()
            .isString()
            .withMessage("Accreditation must be a string"),
        body("campusSize")
            .optional()
            .isString()
            .withMessage("Campus size must be a string"),
        body("address")
            .optional()
            .isString()
            .withMessage("Address must be a string"),
        body("city")
            .optional()
            .isString()
            .withMessage("City must be a string"),
        body("state")
            .optional()
            .isString()
            .withMessage("State must be a string"),
        body("country")
            .optional()
            .isString()
            .withMessage("Country must be a string"),
        body("overview")
            .optional()
            .isString()
            .withMessage("Overview must be a string"),
        body("vision")
            .optional()
            .isString()
            .withMessage("Vision must be a string"),
        body("mission")
            .optional()
            .isString()
            .withMessage("Mission must be a string"),
        body("history")
            .optional()
            .isString()
            .withMessage("History must be a string"),
        body("metaTitle")
            .optional()
            .isString()
            .withMessage("Meta title must be a string"),
        body("metaKeywords")
            .optional()
            .isString()
            .withMessage("Meta keywords must be a string"),
        body("metaDescription")
            .optional()
            .isString()
            .withMessage("Meta description must be a string"),
        body("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be a boolean"),
    ],
    createCollege
);

/** Get all colleges */
router.get("/all",
    [
        query("page").optional().isInt().withMessage("No of pages should be Integer"),
        query("visible").optional().isBoolean().withMessage("No of pages should be Integer"),
        query("limit").optional().isInt().withMessage("Limit should be Integer"),
    ],
    loggerMiddleware, getColleges);

/** Get college filters data */
router.get("/filterdata", loggerMiddleware, getFilterData);

/** GET college by filters */
router.get("/filter",
    [query("categoryId").optional().isInt().withMessage("Category Id must be an integer"),
    query("type").optional().isIn(["college", "university"]).withMessage("Type must be either 'college' or 'university'"),
    query("city").optional().isString().withMessage("City must be a string"),
    query("minRating").optional().isFloat({ min: 0, max: 5 }).withMessage("Min rating must be between 0 and 5"),
    query("minFee").optional().isFloat({ min: 0 }).withMessage("Min fee must be a positive number"),
    query("maxFee").optional().isFloat({ min: 0 }).withMessage("Max fee must be a positive number")
    ],
    loggerMiddleware, filterColleges);

/** Get college compare data */
router.get("/compare",
    [body("collegeIds").isArray({ min: 2, max: 4 }).withMessage("College IDs must be an array of 2 to 4 integers"),
    ], loggerMiddleware, compareColleges);

/** Get single college */
router.get(
    "/:idOrSlug",
    loggerMiddleware,
    [param("idOrSlug").notEmpty().withMessage("ID or Slug is required")],
    getCollegeByIdOrSlug
);

/** Update college */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt().withMessage("ID must be an integer")],
    updateCollege
);

/** Delete college */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt().withMessage("ID must be an integer")],
    deleteCollege
);

module.exports = router;
