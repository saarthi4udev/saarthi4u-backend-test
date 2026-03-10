const News = require("../models/News");
const { Op, fn, col, where } = require("sequelize");
const {
    successCode,
    duplicateDataCode,
    badGatewayCode,
    notFoundCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/**
 * Create News (Admin only)
 */
exports.createNews = async (req, res) => {
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
                error: "News title required",
            });
        }

        title = title.trim();

        // Case-insensitive duplicate title check
        const existing = await News.findOne({
            where: where(fn("LOWER", col("title")), title.toLowerCase()),
        });

        if (existing) {
            return res.status(duplicateDataCode).json({
                error: "News title already exists",
            });
        }

        // Duplicate slug check
        const slugExists = await News.findOne({ where: { slug } });

        if (slugExists) {
            return res.status(duplicateDataCode).json({
                error: "Slug already exists",
            });
        }

        const news = await News.create({
            ...req.body,
            title,
        });

        return res.status(successCode).json({
            message: "News created successfully",
            data: news,
        });

    } catch (error) {
        console.error("Create news error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Update News (Admin only)
 */
exports.updateNews = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const news = await News.findByPk(id);

        if (!news) {
            return res.status(notFoundCode).json({
                error: "News not found",
            });
        }

        let { title, slug } = req.body;

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(duplicateDataCode).json({
                    error: "News title required",
                });
            }

            title = title.trim();

            const exists = await News.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("title")), title.toLowerCase()),
                        { id: { [Op.ne]: id } },
                    ],
                },
            });

            if (exists) {
                return res.status(duplicateDataCode).json({
                    error: "News title already exists",
                });
            }

            req.body.title = title;
        }

        if (slug !== undefined) {
            const slugExists = await News.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id },
                },
            });

            if (slugExists) {
                return res.status(duplicateDataCode).json({
                    error: "Slug already exists",
                });
            }
        }

        await news.update(req.body);

        return res.status(successCode).json({
            message: "News updated successfully",
            data: news,
        });

    } catch (error) {
        console.error("Update news error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Get All News
 */
exports.getAllNews = async (req, res) => {
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

        const news = await News.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["publishedAt", "DESC"]],
        });

        return res.status(successCode).json({
            total: news.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(news.count / limit),
            data: news.rows,
        });

    } catch (error) {
        console.error("Get news error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Get News by ID or Slug
 */
exports.getNewsByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const news = await News.findOne({
            where: {
                [Op.or]: [
                    { id: identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!news || (!news.visible && !isAdmin(req))) {
            return res.status(notFoundCode).json({
                error: "News not found",
            });
        }

        return res.status(successCode).json({
            data: news,
        });

    } catch (error) {
        console.error("Get news error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Delete News (Soft delete)
 */
exports.deleteNews = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const news = await News.findByPk(req.params.id);

        if (!news) {
            return res.status(notFoundCode).json({
                error: "News not found",
            });
        }

        await news.destroy();

        return res.status(successCode).json({
            message: "News deleted successfully",
        });

    } catch (error) {
        console.error("Delete news error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};