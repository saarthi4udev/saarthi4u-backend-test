const { Op, fn, col, where } = require("sequelize");
const Scholarship = require("../models/Scholarship");
const {
    successCode,
    notFoundCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

// ===============================
// CREATE SCHOLARSHIP
// ===============================
exports.createScholarship = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { name, slug, categoryId, scholarshipType, level, provider } = req.body;

        if (!name || !slug || !categoryId || !scholarshipType || !level || !provider) {
            return res.status(duplicateDataCode).json({
                error: "name, slug, categoryId, scholarshipType, level and provider are required",
            });
        }

        name = name.trim();

        const existingScholarship = await Scholarship.findOne({
            where: where(fn("LOWER", col("name")), name.toLowerCase()),
        });

        if (existingScholarship) {
            return res.status(duplicateDataCode).json({ error: "Scholarship name already exists" });
        }

        const existingSlug = await Scholarship.findOne({ where: { slug } });
        if (existingSlug) {
            return res.status(duplicateDataCode).json({ error: "Slug already exists" });
        }

        const scholarship = await Scholarship.create({
            ...req.body,
            name,
        });

        return res.status(successCode).json({
            message: "Scholarship created successfully",
            data: scholarship,
        });

    } catch (error) {
        console.error("Create scholarship error:", error);
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

// ===============================
// GET ALL SCHOLARSHIPS
// ===============================
exports.getAllScholarships = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            level,
            scholarshipType,
            visible,
        } = req.query;

        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`,
            };
        }

        if (level) whereClause.level = level;
        if (scholarshipType) whereClause.scholarshipType = scholarshipType;
        if (visible !== undefined) whereClause.visible = visible;

        const scholarships = await Scholarship.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            total: scholarships.count,
            page: parseInt(page),
            totalPages: Math.ceil(scholarships.count / limit),
            data: scholarships.rows,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// GET SINGLE SCHOLARSHIP
// ===============================
exports.getScholarshipByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const scholarship = await Scholarship.findOne({
            where: {
                [Op.or]: [
                    { id: isNaN(identifier) ? null : identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: "Scholarship not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: scholarship,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// UPDATE SCHOLARSHIP
// ===============================
exports.updateScholarship = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const scholarship = await Scholarship.findByPk(id);

        if (!scholarship) {
            return res.status(404).json({ error: "Scholarship not found" });
        }

        let { name, slug } = req.body;

        if (name !== undefined) {
            name = name.trim();

            const existingScholarship = await Scholarship.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("name")), name.toLowerCase()),
                        { id: { [Op.ne]: id } },
                    ],
                },
            });

            if (existingScholarship) {
                return res.status(duplicateDataCode).json({ error: "Scholarship name already exists" });
            }

            req.body.name = name;
        }

        if (slug !== undefined) {
            const existingSlug = await Scholarship.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id },
                },
            });

            if (existingSlug) {
                return res.status(duplicateDataCode).json({ error: "Slug already exists" });
            }
        }

        await scholarship.update(req.body);

        return res.status(successCode).json({
            message: "Scholarship updated successfully",
            data: scholarship,
        });

    } catch (error) {
        console.error("Update scholarship error:", error);
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

// ===============================
// SOFT DELETE SCHOLARSHIP
// ===============================
exports.deleteScholarship = async (req, res) => {
    try {
        const { id } = req.params;

        const scholarship = await Scholarship.findByPk(id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: "Scholarship not found",
            });
        }

        await scholarship.destroy();

        return res.status(200).json({
            success: true,
            message: "Scholarship deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};