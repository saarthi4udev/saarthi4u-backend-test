const { Op, fn, col, where, literal } = require("sequelize");
const Exam = require("../models/Exam");
const {
    successCode,
    notFoundCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

// ===============================
// CREATE EXAM
// ===============================
exports.createExam = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { name, slug, categoryId, level, examMode, examType, conductingBody } = req.body;

        // ✅ Required fields check
        if (!name || !slug || !categoryId || !level || !examMode || !examType || !conductingBody) {
            return res.status(duplicateDataCode).json({
                error: "name, slug, categoryId, level, examMode, examType and conductingBody are required",
            });
        }

        if (!name || !name.trim()) {
            return res.status(duplicateDataCode).json({ error: "Exam name required" });
        }

        name = name.trim();

        // ✅ Duplicate name check (case-insensitive)
        const existingExam = await Exam.findOne({
            where: where(fn("LOWER", col("name")), name.toLowerCase()),
        });

        if (existingExam) {
            return res.status(duplicateDataCode).json({ error: "Exam name already exists" });
        }

        // 🔒 Duplicate slug check
        if (slug) {
            const exists = await Exam.findOne({ where: { slug } });
            if (exists) {
                return res.status(duplicateDataCode).json({ error: "Slug already exists" });
            }
        }

        const exam = await Exam.create({
            ...req.body,
            name, // trimmed name
        });

        return res.status(successCode).json({
            message: "Exam created successfully",
            data: exam,
        });

    } catch (error) {
        console.error("Create exam error:", error);
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

// ===============================
// GET ALL EXAMS (Pagination + Search + Filter)
// ===============================
exports.getAllExams = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            level,
            examMode,
            examType,
            visible,
        } = req.query;

        const offset = (page - 1) * limit;

        let whereClause = {};

        // Search by name
        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`,
            };
        }

        // Filters
        if (level) whereClause.level = level;
        if (examMode) whereClause.examMode = examMode;
        if (examType) whereClause.examType = examType;
        if (visible !== undefined) whereClause.visible = visible;

        const exams = await Exam.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            total: exams.count,
            page: parseInt(page),
            totalPages: Math.ceil(exams.count / limit),
            data: exams.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// GET SINGLE EXAM (by ID or Slug)
// ===============================
exports.getExamByIdOrSlug = async (req, res) => {
    try {
        const { identifier } = req.params;

        const exam = await Exam.findOne({
            where: {
                [Op.or]: [
                    { id: isNaN(identifier) ? null : identifier },
                    { slug: identifier },
                ],
            },
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: exam,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// UPDATE EXAM
// ===============================
exports.updateExam = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const exam = await Exam.findByPk(id);

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        let { name, slug } = req.body;

        // ✅ If name is being updated
        if (name !== undefined) {

            if (!name || !name.trim()) {
                return res.status(duplicateDataCode).json({ error: "Exam name required" });
            }

            name = name.trim();

            // 🔍 Duplicate name check (excluding current exam)
            const existingExam = await Exam.findOne({
                where: {
                    [Op.and]: [
                        where(fn("LOWER", col("name")), name.toLowerCase()),
                        { id: { [Op.ne]: id } },
                    ],
                },
            });

            if (existingExam) {
                return res.status(duplicateDataCode).json({ error: "Exam name already exists" });
            }

            req.body.name = name;
        }

        // 🔒 If slug is being updated
        if (slug !== undefined) {
            const existingSlug = await Exam.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: id },
                },
            });

            if (existingSlug) {
                return res.status(duplicateDataCode).json({ error: "Slug already exists" });
            }
        }

        await exam.update(req.body);

        return res.status(successCode).json({
            message: "Exam updated successfully",
            data: exam,
        });

    } catch (error) {
        console.error("Update exam error:", error);
        return res.status(badGatewayCode).json({ error: "Server error" });
    }
};

// ===============================
// SOFT DELETE EXAM
// ===============================
exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await Exam.findByPk(id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found",
            });
        }

        await exam.destroy(); // Soft delete (because paranoid: true)

        return res.status(200).json({
            success: true,
            message: "Exam deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};