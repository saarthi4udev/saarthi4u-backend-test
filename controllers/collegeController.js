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
const Recruiter = require("../models/Recruiter");
const { Op, fn, col, where, literal } = require("sequelize");


const {
    successCode,
    notFoundCode,
    duplicateDataCode,
    badGatewayCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";


/**
 *  Create College (Admin only)
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
 *  Get Colleges List
 * - Public → visible only
 * - Admin → all
 */
exports.getColleges = async (req, res) => {
    try {
        const whereCondition = {};

        if (!isAdmin(req)) {
            whereCondition.visible = true;
        }

        // Get page & limit from query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const { count, rows: colleges } = await College.findAndCountAll({
            where: whereCondition,
            include: Category,
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        if (!colleges.length) {
            return res.status(notFoundCode).json({ message: "No colleges found" });
        }

        res.status(successCode).json({
            data: colleges,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};


/**
 *  Get Single College (FULL PROFILE)
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
                { model: Recruiter },
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
 *  Update College (Admin only)
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
 *  Delete College (Admin only – soft delete)
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


/**
 *  Get Filter Data
 * Returns available filters for frontend
 */
exports.getFilterData = async (req, res) => {
    try {
        const colleges = await College.findAll({
            include: [
                { model: Category, attributes: ["id", "name"] },
                {
                    model: Course,
                    attributes: ["id"],
                    include: [{ model: Fee, attributes: ["totalFee"] }],
                },
                { model: Review, attributes: ["rating"] },
            ],
        });

        //  Prepare filter sets
        const cities = new Set();
        const types = new Set();
        const categories = new Map();
        const ratings = [];
        const fees = [];

        colleges.forEach((college) => {
            if (college.city) cities.add(college.city);
            if (college.type) types.add(college.type);

            if (college.Category) {
                categories.set(college.Category.id, college.Category.name);
            }

            // collect ratings
            college.Reviews?.forEach((r) => ratings.push(r.rating));

            // collect fees
            college.Courses?.forEach((course) => {
                course.Fees?.forEach((fee) => fees.push(fee.totalFee));
            });
        });

        const response = {
            cities: [...cities],
            types: [...types],
            categories: [...categories].map(([id, name]) => ({ id, name })),
            ratingRange: ratings.length
                ? { min: Math.min(...ratings), max: Math.max(...ratings) }
                : { min: 0, max: 0 },
            feeRange: fees.length
                ? { min: Math.min(...fees), max: Math.max(...fees) }
                : { min: 0, max: 0 },
        };

        //  Always return success, even if empty
        res.json({ data: response });

    } catch (error) {
        console.error("Filter data error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 *  Filter Colleges
 */
exports.filterColleges = async (req, res) => {
    try {
        const { city, type, categoryId, minRating, minFee, maxFee } = req.query;

        const where = {};
        if (city) where.city = city;
        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;

        const colleges = await College.findAll({
            where,
            include: [
                { model: Category },

                //  Filter by fee range
                {
                    model: Course,
                    required: !!(minFee || maxFee),
                    include: [
                        {
                            model: Fee,
                            required: !!(minFee || maxFee),
                            where: {
                                ...(minFee && { totalFee: { [Op.gte]: minFee } }),
                                ...(maxFee && { totalFee: { [Op.lte]: maxFee } }),
                            },
                        },
                    ],
                },

                //  Reviews only for rating calculation
                {
                    model: Review,
                    attributes: [],
                },
            ],

            attributes: {
                include: [
                    // ⭐ Calculate average rating via subquery (no GROUP BY needed)
                    [
                        literal(`(
              SELECT AVG(r.rating)
              FROM Reviews r
              WHERE r.collegeId = College.id
            )`),
                        "avgRating",
                    ],
                ],
            },

            // Rating filter using HAVING-like condition
            having: minRating
                ? literal(`avgRating >= ${Number(minRating)}`)
                : undefined,

            subQuery: false,
            distinct: true,
        });

        res.json({ data: colleges });
    } catch (error) {
        console.error("Filter colleges error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 *  Compare Colleges
 */
exports.compareColleges = async (req, res) => {
    try {
        const { collegeIds } = req.body;

        if (!collegeIds || !collegeIds.length) {
            return res.status(400).json({ error: "collegeIds required" });
        }

        if (collegeIds.length < 2 || collegeIds.length > 5) {
            return res.status(400).json({ error: "Minimum 2 & Maximum 5 colleges can be compared" });
        }

        // fetch all colleges data
        const colleges = await College.findAll({
            where: { id: collegeIds },
            include: [
                Category,
                { model: Faculty },
                { model: Review },
                { model: Placement },
                { model: Recruiter },
                { model: Facility },
                {
                    model: Course,
                    include: [Fee],
                },
            ],
        });

        const comparison = colleges.map((college) => {
            // calculate avg rating
            const avgRating =
                college.Reviews?.length
                    ? college.Reviews.reduce((sum, r) => sum + r.rating, 0) /
                    college.Reviews.length
                    : 0;

            const allFees = college.Courses.flatMap((c) =>
                c.Fees.map((f) => f.totalFee)
            );

            // calculate avg fees
            const avgFees =
                allFees.length > 0
                    ? Math.round(allFees.reduce((a, b) => a + b, 0) / allFees.length)
                    : 0;

            // faculty count
            const facultyCount = college.Faculties?.length || 0;


            const totalSeats = college.Courses.reduce(
                (sum, c) => sum + (c.totalSeats || 0),
                0
            );

            //faculty to student ratio
            const studentFacultyRatio =
                facultyCount && totalSeats
                    ? Math.round(totalSeats / facultyCount)
                    : null;

            const highestPackage = college.Placements?.[0]?.highestPackage || 0;
            const averagePackage = college.Placements?.[0]?.averagePackage || 0;
            const recruiterCount = college.Recruiters?.length || 0;

            const placementScore =
                highestPackage * 0.4 +
                averagePackage * 0.4 +
                recruiterCount * 10000 * 0.2;

            const overallScore =
                avgRating * 20 +
                placementScore / 100000 +
                facultyCount * 2;

            return {
                id: college.id,
                name: college.name,
                city: college.city,
                type: college.type,
                category: college.Category?.name,

                avgRating: Number(avgRating.toFixed(1)),
                avgFees,
                facultyCount,
                studentFacultyRatio,
                highestPackage,
                averagePackage,
                recruiterCount,
                placementScore: Math.round(placementScore),
                overallScore: Math.round(overallScore),

                highlights: [
                    avgRating >= 4.5 && "Top Rated",
                    highestPackage >= 2000000 && "Excellent Placements",
                    recruiterCount >= 50 && "Strong Industry Connections",
                    studentFacultyRatio && studentFacultyRatio <= 15 && "Low Student-Faculty Ratio",
                ].filter(Boolean),

                facilities: college.Facilities?.map((f) => f.name),
                recruiters: college.Recruiters?.map((r) => r.name),

                courses: college.Courses.map((c) => ({
                    name: c.name,
                    duration: c.duration,
                    fee: c.Fees?.[0]?.totalFee || null,
                })),
            };
        });

        // Sort by overall score
        comparison.sort((a, b) => b.overallScore - a.overallScore);

        // CATEGORY WINNERS
        const bestOverall = comparison[0];

        const bestRating = [...comparison].sort((a, b) => b.avgRating - a.avgRating)[0];
        const bestPlacement = [...comparison].sort(
            (a, b) => b.placementScore - a.placementScore
        )[0];
        const bestROI = [...comparison].sort(
            (a, b) => a.avgFees - b.avgFees
        )[0];
        const bestFacultyRatio = [...comparison]
            .filter((c) => c.studentFacultyRatio)
            .sort((a, b) => a.studentFacultyRatio - b.studentFacultyRatio)[0];

        // Final Verdict Builder
        const verdict = {
            winner: bestOverall.name,
            summary: `${bestOverall.name} stands out as the best overall choice based on ratings, placements, and faculty strength.`,
            categoryLeaders: {
                bestOverall: bestOverall.name,
                bestRating: bestRating?.name,
                bestPlacement: bestPlacement?.name,
                bestROI: bestROI?.name,
                bestFacultyRatio: bestFacultyRatio?.name,
            },
        };

        res.status(successCode).json({
            data: comparison,
            verdict,
        });
    } catch (error) {
        console.error("Compare colleges error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};