const { Op } = require("sequelize");
const Mentor = require("../models/Mentor");

const isAdmin = (req) => req.user?.role === "admin";

/** CREATE */
exports.createMentor = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const existing = await Mentor.findOne({ where: { name } });

        if (existing) {
            return res.status(409).json({ error: "Mentor already exists" });
        }

        const mentor = await Mentor.create(req.body);

        return res.status(201).json({
            message: "Mentor created successfully",
            data: mentor,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** GET ALL */
exports.getAllMentors = async (req, res) => {
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

        const mentors = await Mentor.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            total: mentors.count,
            page: parseInt(page),
            totalPages: Math.ceil(mentors.count / limit),
            data: mentors.rows,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** GET SINGLE */
exports.getMentorById = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await Mentor.findByPk(id);

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        return res.status(200).json({ data: mentor });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** UPDATE */
exports.updateMentor = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const mentor = await Mentor.findByPk(id);

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        await mentor.update(req.body);

        return res.status(200).json({
            message: "Mentor updated successfully",
            data: mentor,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/** DELETE */
exports.deleteMentor = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await Mentor.findByPk(id);

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        await mentor.destroy();

        return res.status(200).json({
            message: "Mentor deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};