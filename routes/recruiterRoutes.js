const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
    createRecruiter,
    getRecruitersByCollege,
    deleteRecruiter,
} = require("../controllers/recruiterController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/* 🔹 Validation Middleware */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};


// ===============================
// 🔹 Create Recruiter
// ===============================
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("collegeId")
            .notEmpty().withMessage("collegeId is required")
            .isInt().withMessage("collegeId must be an integer"),

        body("name")
            .notEmpty().withMessage("Recruiter name is required")
            .isString().withMessage("Name must be a string")
            .isLength({ min: 2, max: 100 })
            .withMessage("Name must be 2-100 characters"),
    ],
    validate,
    createRecruiter
);


// ===============================
// 🔹 Get Recruiters by College
// ===============================
router.get(
    "/college/:collegeId",
    loggerMiddleware,
    [
        param("collegeId")
            .notEmpty().withMessage("collegeId param is required")
            .isInt().withMessage("collegeId must be an integer"),
    ],
    validate,
    getRecruitersByCollege
);


// ===============================
// 🔹 Delete Recruiter
// ===============================
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .notEmpty().withMessage("Recruiter ID is required")
            .isInt().withMessage("ID must be an integer"),
    ],
    validate,
    deleteRecruiter
);

module.exports = router;
