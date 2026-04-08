const Blog = require("../models/Blog");
const { Op, fn, col, where } = require("sequelize");
const {
    successCode,
    duplicateDataCode,
    badGatewayCode,
    notFoundCode,
} = require("../config/statuscodes");
const fs = require("node:fs");
const { storeImage } = require("../helpers/cloudinary");

const isAdmin = (req) => req.user?.role === "admin";


exports.createBlog = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { title, slug, categoryId } = req.body;

        if (!title || !slug || !categoryId) {
            return res.status(duplicateDataCode).json({
                error: "title, slug and categoryId are required",
            });
        }

        if (!title.trim()) {
            return res.status(duplicateDataCode).json({
                error: "Blog title required",
            });
        }

        title = title.trim();

        // ✅ Duplicate title (case-insensitive)
        const existingBlog = await Blog.findOne({
            where: where(fn("LOWER", col("title")), title.toLowerCase()),
        });

        if (existingBlog) {
            return res
                .status(duplicateDataCode)
                .json({ error: "Blog title already exists" });
        }

        let featuredImageUrl = null;
        const folderName = "blogs_data";

        // ===============================
        // Upload Featured Image If Provided
        // ===============================
        if (req.file) {
            const uploadResult = await storeImage(
                req.file.path,
                `blog_${title}`,
                folderName
            );

            featuredImageUrl = uploadResult.url;

            fs.unlinkSync(req.file.path);
        }

        // 🔒 Duplicate slug check
        const slugExists = await Blog.findOne({ where: { slug } });
        if (slugExists) {
            return res
                .status(duplicateDataCode)
                .json({ error: "Slug already exists" });
        }

        const blog = await Blog.create({
            ...req.body,
            title,
            featuredImage: featuredImageUrl,
        });

        return res.status(successCode).json({
            message: "Blog created successfully",
            data: blog,
        });

    } catch (error) {
        console.error("Create blog error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.status(notFoundCode).json({
                error: "Blog not found",
            });
        }

        let { title, slug } = req.body;

        // 🔁 Title duplicate check
        if (title !== undefined) {

            if (!title.trim()) {
                return res.status(duplicateDataCode).json({
                    error: "Blog title required",
                });
            }

            title = title.trim();

            const exists = await Blog.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("title")), title.toLowerCase()),
                        { id: { [Op.ne]: id } },
                    ],
                },
            });

            if (exists) {
                return res.status(duplicateDataCode).json({
                    error: "Blog title already exists",
                });
            }

            req.body.title = title;
        }

        // 🔒 Slug duplicate check
        if (slug !== undefined) {
            const slugExists = await Blog.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id },
                },
            });

            if (slugExists) {
                return res
                    .status(duplicateDataCode)
                    .json({ error: "Slug already exists" });
            }
        }

        let featuredImageUrl = blog.featuredImage;
        const folderName = "blogs_data";

        // ===============================
        // Upload Featured Image If Provided
        // ===============================
        if (req.file) {
            const uploadResult = await storeImage(
                req.file.path,
                `blog_${title}`,
                folderName
            );

            featuredImageUrl = uploadResult.url;

            fs.unlinkSync(req.file.path);
        }

        await blog.update({
            ...req.body,
            featuredImage: featuredImageUrl,
        });

        return res.status(successCode).json({
            message: "Blog updated successfully",
            data: blog,
        });

    } catch (error) {
        console.error("Update blog error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, visible } = req.query;

        const offset = (page - 1) * limit;

        let whereCondition = {};

        if (search) {
            whereCondition.title = {
                [Op.like]: `%${search}%`,
            };
        }

        if (!isAdmin(req)) {
            whereCondition.visible = true;
        } else if (visible !== undefined) {
            whereCondition.visible = visible;
        }

        const blogs = await Blog.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(successCode).json({
            total: blogs.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(blogs.count / limit),
            data: blogs.rows,
        });

    } catch (error) {
        console.error("Get blogs error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

exports.getBlogByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const blog = await Blog.findOne({
            where: {
                [Op.or]: [
                    { id: isNaN(identifier) ? null : identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!blog || (!blog.visible && !isAdmin(req))) {
            return res.status(notFoundCode).json({
                error: "Blog not found",
            });
        }

        return res.status(successCode).json({
            data: blog,
        });

    } catch (error) {
        console.error("Get blog error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            return res.status(notFoundCode).json({
                error: "Blog not found",
            });
        }

        await blog.destroy();

        return res.status(successCode).json({
            message: "Blog deleted successfully",
        });

    } catch (error) {
        console.error("Delete blog error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};