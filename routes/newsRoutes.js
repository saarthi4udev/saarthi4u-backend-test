const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createNews,
    updateNews,
    getAllNews,
    getNewsByIdOrSlug,
    deleteNews,
} = require("../controllers/newsController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/** Create News */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("title").isString().isLength({ min: 3, max: 255 }),
        body("slug").isString().notEmpty(),
        body("categoryId").isInt(),
    ],
    createNews
);

/** Get All News */
router.get(
    "/all",
    [
        query("page").optional().isInt(),
        query("limit").optional().isInt(),
        query("visible").optional().isBoolean(),
    ],
    loggerMiddleware,
    getAllNews
);

/** Get Single News */
router.get(
    "/new/:identifier",
    loggerMiddleware,
    [param("identifier").notEmpty()],
    getNewsByIdOrSlug
);

/** Update News */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").notEmpty()],
    updateNews
);

/** Delete News */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").notEmpty()],
    deleteNews
);

module.exports = router;