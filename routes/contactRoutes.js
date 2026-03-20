const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact,
} = require("../controllers/contactController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Submit Contact Form */
router.post(
    "/create",
    loggerMiddleware,
    [
        body("name").isString().isLength({ min: 2 }),
        body("email").isEmail(),
        body("subject").isString().isLength({ min: 3 }),
        body("message").isString().isLength({ min: 5 }),

        body("courseInterest")
            .optional()
            .isString()
            .isLength({ min: 2 }),

        body("preferredLocation")
            .optional()
            .isString()
            .isLength({ min: 2 }),

        body("phone")
            .optional()
            .isString()
            .isLength({ min: 7, max: 15 }),
    ],
    createContact
);

/** Get All Contacts (Admin) */
router.get(
    "/all",
    verifyToken,
    loggerMiddleware,
    [
        query("page").optional().isInt(),
        query("limit").optional().isInt(),
    ],
    getAllContacts
);

/** Get Single Contact */
router.get(
    "/contact/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").notEmpty()],
    getContactById
);


/** Delete Contact */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").notEmpty()],
    deleteContact
);

module.exports = router;