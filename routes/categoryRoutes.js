const express = require("express");
const { body, param, query } = require("express-validator");
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");

const router = express.Router();

/**
 * Create Category (Admin only)
 */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    [
        body("name")
            .isString()
            .isLength({ min: 2 })
            .withMessage("Category name must be at least 2 characters"),
        body("description").optional().isString(),
        body("visible").optional().isBoolean(),
    ],
    createCategory
);

/**
 * Get all categories
 * - Admin → all
 * - Public → only visible
 */
router.get(
    "/all",
    loggerMiddleware,
    [
        query("visible")
            .optional()
            .isString()
            .withMessage("visible must be true or false or all"),
    ],
    getCategories
);  

/**
 * Get category by ID (Public)
 */
router.get(
    "/category/:id",
    loggerMiddleware,
    [param("id").isInt().withMessage("Invalid category ID")],
    getCategoryById
);

/**
 * Update Category (Admin only)
 */
router.put(
    "/update/:id",
    verifyToken,
    loggerMiddleware,
    [
        param("id").isInt().withMessage("Invalid category ID"),
        body("name").optional().isString(),
        body("description").optional().isString(),
        body("visible").optional().isBoolean(),
    ],
    updateCategory
);

/**
 * Delete Category (Admin only – soft delete)
 */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isInt().withMessage("Invalid category ID")],
    deleteCategory
);

module.exports = router;
