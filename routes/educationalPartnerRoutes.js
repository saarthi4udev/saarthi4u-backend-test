const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createEducationalPartner,
    getAllEducationalPartners,
    getEducationalPartnerByIdOrSlug,
    updateEducationalPartner,
    deleteEducationalPartner,
} = require("../controllers/educationalPartnerController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** CREATE */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("name").isString().notEmpty(),
        body("slug").isString().notEmpty(),
        body("image").optional().isString(),
        body("description").optional().isString(),
        body("services").optional().isString(),
        body("tag").optional().isString(),
    ],
    createEducationalPartner
);

/** GET ALL */
router.get(
    "/all",
    loggerMiddleware,
    [
        query("page").optional().isInt(),
        query("limit").optional().isInt(),
        query("search").optional().isString(),
    ],
    getAllEducationalPartners
);

/** GET SINGLE */
router.get(
    "/:identifier",
    loggerMiddleware,
    [param("identifier").notEmpty()],
    getEducationalPartnerByIdOrSlug
);

/** UPDATE */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    updateEducationalPartner
);

/** DELETE */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt()],
    deleteEducationalPartner
);

module.exports = router;