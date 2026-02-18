const express = require("express");
const { body, param } = require("express-validator");
const {
    createCollege,
    getColleges,
    getCollegeByIdOrSlug,
    updateCollege,
    deleteCollege,
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
        body("name").isString().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
        body("slug").isString().withMessage("Slug must be a string and is required"),
        body("categoryId").isInt().withMessage("Category ID must be an integer"),
        body("type").isIn(["college", "university"]).withMessage("Type must be either 'college' or 'university'"),
    ],
    createCollege
);

/** Get all colleges */
router.get("/all", loggerMiddleware, getColleges);

/** Get single college */
router.get(
    "/:idOrSlug",
    loggerMiddleware,
    [param("idOrSlug").notEmpty()],
    getCollegeByIdOrSlug
);

/** Update college */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    updateCollege
);

/** Delete college */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    deleteCollege
);

module.exports = router;
