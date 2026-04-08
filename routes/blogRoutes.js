const express = require("express");
const { body, param, query } = require("express-validator");
const {
    createBlog,
    getAllBlogs,
    getBlogByIdOrSlug,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/temp/" });
const router = express.Router();

/** ===============================
 *  Create Blog
 *  =============================== */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    upload.single("featuredImage"),
    [
        body("title")
            .isString()
            .isLength({ min: 3, max: 255 })
            .withMessage("Title must be 3-255 characters long"),

        body("slug")
            .isString()
            .notEmpty()
            .withMessage("Slug must be a non-empty string"),

        body("categoryId")
            .isInt()
            .withMessage("Category ID must be an integer"),

        body("excerpt")
            .optional()
            .isString()
            .withMessage("Excerpt must be a string"),

        body("content")
            .isString()
            .notEmpty()
            .withMessage("Content is required"),

        body("metaTitle")
            .optional()
            .isString()
            .withMessage("Meta title must be a string"),

        body("metaDescription")
            .optional()
            .isString()
            .withMessage("Meta description must be a string"),

        body("metaKeywords")
            .optional()
            .isString()
            .withMessage("Meta keywords must be a string"),

        body("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),

        body("isFeatured")
            .optional()
            .isBoolean()
            .withMessage("isFeatured must be boolean"),

        body("publishedAt")
            .optional()
            .isISO8601()
            .withMessage("Published date must be valid ISO date"),
    ],
    createBlog
);


/** ===============================
 *  Get All Blogs
 *  =============================== */
router.get(
    "/all",
    loggerMiddleware,
    [
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be integer"),

        query("limit")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Limit must be integer"),

        query("search")
            .optional()
            .isString()
            .withMessage("Search must be string"),

        query("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),
    ],
    getAllBlogs
);


/** ===============================
 *  Get Single Blog (ID or Slug)
 *  =============================== */
router.get(
    "/blog/:identifier",
    loggerMiddleware,
    [
        param("identifier")
            .notEmpty()
            .withMessage("Blog ID or Slug is required"),
    ],
    getBlogByIdOrSlug
);


/** ===============================
 *  Update Blog
 *  =============================== */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    upload.single("featuredImage"),
    [
        param("id")
            .isUUID()
            .withMessage("Blog ID must be a valid UUID"),

        body("title")
            .optional()
            .isString()
            .isLength({ min: 3, max: 255 })
            .withMessage("Title must be 3-255 characters"),

        body("slug")
            .optional()
            .isString()
            .withMessage("Slug must be string"),

        body("categoryId")
            .optional()
            .isInt()
            .withMessage("Category ID must be integer"),

        body("content")
            .optional()
            .isString()
            .withMessage("Content must be string"),

        body("visible")
            .optional()
            .isBoolean()
            .withMessage("Visible must be boolean"),

        body("isFeatured")
            .optional()
            .isBoolean()
            .withMessage("isFeatured must be boolean"),
    ],
    updateBlog
);


/** ===============================
 *  Delete Blog (Soft Delete)
 *  =============================== */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id")
            .isUUID()
            .withMessage("Blog ID must be valid UUID"),
    ],
    deleteBlog
);


module.exports = router;