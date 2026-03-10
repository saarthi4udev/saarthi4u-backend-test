const { Op, fn, col, where } = require("sequelize");
const InternationalCollege = require("../models/InternationalCollege");

const {
    successCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/** CREATE */
exports.createInternationalCollege = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { name, slug, location } = req.body;

        if (!name || !slug || !location) {
            return res.status(duplicateDataCode).json({
                error: "name, slug and location are required",
            });
        }

        name = name.trim();

        const existingName = await InternationalCollege.findOne({
            where: where(fn("LOWER", col("name")), name.toLowerCase()),
        });

        if (existingName) {
            return res.status(duplicateDataCode).json({
                error: "College name already exists",
            });
        }

        const existingSlug = await InternationalCollege.findOne({
            where: { slug },
        });

        if (existingSlug) {
            return res.status(duplicateDataCode).json({
                error: "Slug already exists",
            });
        }

        const college = await InternationalCollege.create({
            ...req.body,
            name,
        });

        return res.status(successCode).json({
            message: "International College created successfully",
            data: college,
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/** GET ALL */
exports.getAllInternationalColleges = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, visible } = req.query;

        const offset = (page - 1) * limit;
        let whereClause = {};

        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`,
            };
        }

        if (visible !== undefined) {
            whereClause.visible = visible;
        }

        const colleges = await InternationalCollege.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            total: colleges.count,
            page: parseInt(page),
            totalPages: Math.ceil(colleges.count / limit),
            data: colleges.rows,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** GET SINGLE */
exports.getInternationalCollegeByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const college = await InternationalCollege.findOne({
            where: {
                [Op.or]: [
                    { id: isNaN(identifier) ? null : identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!college) {
            return res.status(404).json({
                success: false,
                message: "College not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: college,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** UPDATE */
exports.updateInternationalCollege = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;
        const college = await InternationalCollege.findByPk(id);

        if (!college) {
            return res.status(404).json({ error: "College not found" });
        }

        let { name, slug } = req.body;

        if (name !== undefined) {
            name = name.trim();

            const existingName = await InternationalCollege.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("name")), name.toLowerCase()),
                        { id: { [Op.ne]: id } },
                    ],
                },
            });

            if (existingName) {
                return res.status(duplicateDataCode).json({
                    error: "College name already exists",
                });
            }

            req.body.name = name;
        }

        if (slug !== undefined) {
            const existingSlug = await InternationalCollege.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id },
                },
            });

            if (existingSlug) {
                return res.status(duplicateDataCode).json({
                    error: "Slug already exists",
                });
            }
        }

        await college.update(req.body);

        return res.status(successCode).json({
            message: "International College updated successfully",
            data: college,
        });

    } catch (error) {
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/** DELETE */
exports.deleteInternationalCollege = async (req, res) => {
    try {
        const { id } = req.params;

        const college = await InternationalCollege.findByPk(id);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: "College not found",
            });
        }

        await college.destroy();

        return res.status(200).json({
            success: true,
            message: "College deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};