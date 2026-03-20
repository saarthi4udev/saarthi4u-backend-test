const express = require("express");
const { body, param, query } = require("express-validator");
const {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    deleteConsultation,
} = require("../controllers/onlineConsultationController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create Consultation */
router.post(
    "/create",
    loggerMiddleware,
    [
        body("fullName").isString().isLength({ min: 2 }),
        body("email").isEmail(),
        body("phone").isString().isLength({ min: 7, max: 15 }),

        body("courseInterest").isIn([
            "engineering",
            "medical",
            "management",
            "law",
            "arts",
            "other",
        ]),

        body("preferredStateCity").optional().isString(),

        body("preferredConsultationDate")
            .optional()
            .isISO8601(),

        body("preferredTime")
            .optional()
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),

        body("message").optional().isString(),

        body("sourcePage").optional().isString(),
    ],
    createConsultation
);

/** Get All */
router.get(
    "/all",
    verifyToken,
    loggerMiddleware,
    [
        query("page").optional().isInt({ min: 1 }),
        query("limit").optional().isInt({ min: 1, max: 100 }),
    ],
    getAllConsultations
);

/** Get Single */
router.get(
    "/consultation/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isUUID()],
    getConsultationById
);

/** Delete */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isUUID()],
    deleteConsultation
);

module.exports = router;