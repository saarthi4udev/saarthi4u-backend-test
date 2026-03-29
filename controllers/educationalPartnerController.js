const { Op } = require("sequelize");
const EducationalPartner = require("../models/EducationalPartner");

const isAdmin = (req) => req.user?.role === "admin";

/** CREATE */
exports.createEducationalPartner = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                error: "Name and slug are required",
            });
        }

        const existing = await EducationalPartner.findOne({
            where: {
                [Op.or]: [{ name }, { slug }],
            },
        });

        if (existing) {
            return res.status(409).json({
                error: "University already exists",
            });
        }

        const partner = await EducationalPartner.create(req.body);

        return res.status(201).json({
            message: "University Partner created successfully",
            data: partner,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** GET ALL */
exports.getAllEducationalPartners = async (req, res) => {
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

        const partners = await EducationalPartner.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            total: partners.count,
            page: parseInt(page),
            totalPages: Math.ceil(partners.count / limit),
            data: partners.rows,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** GET SINGLE */
exports.getEducationalPartnerByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const partner = await EducationalPartner.findOne({
            where: {
                [Op.or]: [
                    { id: isNaN(identifier) ? null : identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!partner) {
            return res.status(404).json({
                error: "University not found",
            });
        }

        return res.status(200).json({ data: partner });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** UPDATE */
exports.updateEducationalPartner = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const partner = await EducationalPartner.findByPk(id);

        if (!partner) {
            return res.status(404).json({
                error: "University not found",
            });
        }

        await partner.update(req.body);

        return res.status(200).json({
            message: "Updated successfully",
            data: partner,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** DELETE */
exports.deleteEducationalPartner = async (req, res) => {
    try {
        const { id } = req.params;

        const partner = await EducationalPartner.findByPk(id);

        if (!partner) {
            return res.status(404).json({
                error: "University not found",
            });
        }

        await partner.destroy();

        return res.status(200).json({
            message: "Deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};