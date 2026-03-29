const Category = require("../models/Category");
const College = require("../models/College");
const Course = require("../models/Course");
const Admission = require("../models/Admission");
const Cutoff = require("../models/Cutoff");
const Facility = require("../models/Facility");
const Faculty = require("../models/Faculty");
const FAQ = require("../models/FAQ");
const Fee = require("../models/Fee");
const Review = require("../models/Review");
const Gallery = require("../models/Gallery");
const Placement = require("../models/Placement");
const Recruiter = require("../models/Recruiter");
const Exam = require("../models/Exam");
const Blog = require("../models/Blog");
const News = require("../models/News");
const {
    successCode,
    notFoundCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");
const { Op, fn, col, where } = require("sequelize");

/**
 * Admin only helpers
 */
const isAdmin = (req) => req.user?.role === "admin";

/**
 * Create Category (Admin only)
 */

exports.createCategory = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { name, description, visible } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Category name is required" });
        }

        name = name.trim();

        // ✅ MySQL-safe case-insensitive duplicate check
        const exists = await Category.findOne({
            where: where(fn("LOWER", col("name")), name.toLowerCase()),
        });

        if (exists) {
            return res.status(409).json({ error: "Category name already exists" });
        }

        const category = await Category.create({
            name,
            description,
            visible,
        });

        res.status(201).json({
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ error: "Server error" });
    }
};



/**
 * Get All Categories
 * - Admin → all categories
 * - Others → only visible categories
 */
exports.getCategories = async (req, res) => {
    try {
        const { visible } = req.query;

        let whereCondition = {
            deletedAt: null,
        };

        // Case 1: visible=all → everyone can see all
        if (visible === "all") {
            // no extra condition
            if (!isAdmin(req)) {
                whereCondition.visible = true; // non-admins can only see visible categories
            }
        }
        // Case 2: visible=true or false
        else if (visible === "true") {
            whereCondition.visible = true;
        } else if (visible === "false") {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: "Access denied" });
            }
            whereCondition.visible = false;
        }
        // Case 3: no visible param
        else {
            whereCondition.visible = true;
        }

        const categories = await Category.findAll({
            where: whereCondition,
            order: [["createdAt", "DESC"]],
        });

        if (!categories.length) {
            return res
                .status(notFoundCode)
                .json({ message: "No categories found" });
        }

        res.status(successCode).json({ data: categories });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};


/**
 * Get Category by ID (Everyone)
 */
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category || (!category.visible && !isAdmin(req))) {
            return res.status(notFoundCode).json({ error: "Category not found" });
        }

        res.status(successCode).json({ data: category });
    } catch (error) {
        console.error(error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/**
 * Update Category (Admin only)
 */
exports.updateCategory = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;
        const { name, description, visible } = req.body;

        const category = await Category.findByPk(id);
        if (!category || category.deletedAt) {
            return res.status(notFoundCode).json({ error: "Category not found" });
        }

        // 🔒 Duplicate name check (only if name is being updated)
        if (name && name.trim()) {
            const trimmedName = name.trim();

            const exists = await Category.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("name")), fn("LOWER", trimmedName)),
                        { id: { [Op.ne]: id } },
                        { deletedAt: null },
                    ],
                },
            });

            if (exists) {
                return res
                    .status(duplicateDataCode)
                    .json({ error: "Category name already exists" });
            }

            category.name = trimmedName;
        }

        if (description !== undefined) category.description = description;
        if (visible !== undefined) category.visible = visible;

        await category.save();

        res.status(successCode).json({
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};


/**
 * Delete Category (Admin only – soft delete)
 */
exports.deleteCategory = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(notFoundCode).json({ error: "Category not found" });
        }

        await category.destroy(); // soft delete

        res.status(successCode).json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/**
 * Get Category Content
 */
exports.getCategoryContent = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            page = 1,
            limit = 10,

            examPage = 1,
            examLimit = 10,

            blogPage = 1,
            blogLimit = 10,

            newsPage = 1,
            newsLimit = 10,
        } = req.query;

        const category = await Category.findByPk(id);

        if (!category || (!category.visible && !isAdmin(req))) {
            return res.status(notFoundCode).json({
                error: "Category not found",
            });
        }

        const visibilityCondition = isAdmin(req)
            ? {}
            : { visible: true };

        // 🔹 Colleges
        const collegeOffset = (page - 1) * limit;

        const colleges = await College.findAndCountAll({
            where: {
                categoryId: id,
                ...visibilityCondition,
            },
            limit: parseInt(limit),
            offset: parseInt(collegeOffset),
            order: [["createdAt", "DESC"]],
        });

        // 🔹 Exams
        const examOffset = (examPage - 1) * examLimit;

        const exams = await Exam.findAndCountAll({
            where: {
                categoryId: id,
                ...visibilityCondition,
            },
            limit: parseInt(examLimit),
            offset: parseInt(examOffset),
            order: [["createdAt", "DESC"]],
        });

        // 🔹 Blogs
        const blogOffset = (blogPage - 1) * blogLimit;

        const blogs = await Blog.findAndCountAll({
            where: {
                categoryId: id,
                ...visibilityCondition,
            },
            limit: parseInt(blogLimit),
            offset: parseInt(blogOffset),
            order: [["createdAt", "DESC"]],
        });

        // 🔹 News
        const newsOffset = (newsPage - 1) * newsLimit;

        const news = await News.findAndCountAll({
            where: {
                categoryId: id,
                ...visibilityCondition,
            },
            limit: parseInt(newsLimit),
            offset: parseInt(newsOffset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(successCode).json({
            category,

            colleges: {
                total: colleges.count,
                page: parseInt(page),
                totalPages: Math.ceil(colleges.count / limit),
                data: colleges.rows,
            },

            exams: {
                total: exams.count,
                page: parseInt(examPage),
                totalPages: Math.ceil(exams.count / examLimit),
                data: exams.rows,
            },

            blogs: {
                total: blogs.count,
                page: parseInt(blogPage),
                totalPages: Math.ceil(blogs.count / blogLimit),
                data: blogs.rows,
            },

            news: {
                total: news.count,
                page: parseInt(newsPage),
                totalPages: Math.ceil(news.count / newsLimit),
                data: news.rows,
            },
        });

    } catch (error) {
        console.error("Get category content error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};