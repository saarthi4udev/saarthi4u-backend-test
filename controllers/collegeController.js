const College = require("../models/College");
const Category = require("../models/Category");
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

const {
    successCode,
    notFoundCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");

const { Op } = require("sequelize");

const isAdmin = (req) => req.user?.role === "admin";



/**
 * ✅ Create College (Admin only)
 */
exports.createCollege = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        let { name, slug, categoryId, type } = req.body;

        // check if required fields are present
        if (!name || !slug || !categoryId || !type) {
            return res.status(duplicateDataCode).json({ error: "Name, slug, categoryId and type are required" });
        }

        if (!name || !name.trim()) {
            return res.status(duplicateDataCode).json({ error: "College name required" });
        }

        name = name.trim();

        // duplicate name check (case-insensitive)
        const existingCollege = await College.findOne({
            where: where(fn("LOWER", col("name")), name.toLowerCase()),
        });
        if (existingCollege) {
            return res.status(duplicateDataCode).json({ error: "College name already exists" });
        }

        // 🔒 duplicate slug check
        if (slug) {
            const exists = await College.findOne({ where: { slug } });
            if (exists) {
                return res.status(duplicateDataCode).json({ error: "Slug already exists" });
            }
        }

        const college = await College.create(req.body);

        res.status(successCode).json({
            message: "College created successfully",
            data: college,
        });
    } catch (error) {
        console.error("Create college error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};



/**
 * ✅ Get Colleges List
 * - Public → visible only
 * - Admin → all
 */
exports.getColleges = async (req, res) => {
    try {
        const whereCondition = {};

        if (!isAdmin(req)) {
            whereCondition.visible = true;
        }

        const colleges = await College.findAll({
            where: whereCondition,
            include: Category,
            order: [["createdAt", "DESC"]],
        });

        if (!colleges.length) {
            return res.status(notFoundCode).json({ message: "No colleges found" });
        }

        res.status(successCode).json({ data: colleges });
    } catch (error) {
        console.error(error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};



/**
 * ✅ Get Single College (FULL PROFILE)
 * Supports:
 *   /college/1
 *   /college/iima-ahmedabad
 */
exports.getCollegeByIdOrSlug = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        const whereCondition = isNaN(idOrSlug)
            ? { slug: idOrSlug }
            : { id: idOrSlug };

        const college = await College.findOne({
            where: whereCondition,
            include: [
                { model: Category },
                {
                    model: Course,
                    include: [Fee],
                },
                { model: Admission },
                { model: Cutoff },
                { model: Facility },
                { model: Faculty },
                { model: FAQ },
                { model: Review },
                { model: Gallery },
                { model: Placement },
            ],
        });

        if (!college || (!college.visible && !isAdmin(req))) {
            return res.status(notFoundCode).json({ error: "College not found" });
        }

        res.status(successCode).json({ data: college });
    } catch (error) {
        console.error("Get college error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};



/**
 * ✅ Update College (Admin only)
 */
exports.updateCollege = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;
        const college = await College.findByPk(id);

        if (!college) {
            return res.status(notFoundCode).json({ error: "College not found" });
        }

        // 🔒 slug duplicate check
        if (req.body.slug && req.body.slug !== college.slug) {
            const exists = await College.findOne({
                where: {
                    slug: req.body.slug,
                    id: { [Op.ne]: id },
                },
            });

            if (exists) {
                return res.status(duplicateDataCode).json({ error: "Slug already exists" });
            }
        }

        await college.update(req.body);

        res.status(successCode).json({
            message: "College updated successfully",
            data: college,
        });
    } catch (error) {
        console.error("Update college error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};



/**
 * ✅ Delete College (Admin only – soft delete)
 */
exports.deleteCollege = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const college = await College.findByPk(req.params.id);
        if (!college) {
            return res.status(notFoundCode).json({ error: "College not found" });
        }

        await college.destroy();

        res.status(successCode).json({
            message: "College deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};
