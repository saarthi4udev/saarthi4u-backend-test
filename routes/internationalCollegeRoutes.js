const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createInternationalCollege,
    getAllInternationalColleges,
    getInternationalCollegeByIdOrSlug,
    updateInternationalCollege,
    deleteInternationalCollege,
} = require("../controllers/internationalCollegeController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** CREATE */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("name")
            .isString()
            .isLength({ min: 3, max: 255 }),

        body("slug")
            .isString()
            .notEmpty(),

        body("location")
            .isString()
            .notEmpty(),

        body("description")
            .optional()
            .isString(),

        body("visible")
            .optional()
            .isBoolean(),
    ],
    createInternationalCollege
);

/** GET ALL */
router.get(
    "/all",
    [
        query("page").optional().isInt(),
        query("limit").optional().isInt(),
        query("search").optional().isString(),
        query("visible").optional().isBoolean(),
    ],
    loggerMiddleware,
    getAllInternationalColleges
);

/** GET SINGLE */
router.get(
    "/college/:identifier",
    loggerMiddleware,
    [param("identifier").notEmpty()],
    getInternationalCollegeByIdOrSlug
);

/** UPDATE */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    updateInternationalCollege
);

/** DELETE */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    deleteInternationalCollege
);

module.exports = router;