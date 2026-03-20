const Testimonial = require("../models/Testimonial");
const {
    successCode,
    badGatewayCode,
    notFoundCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/** Create Testimonial (Admin) */
exports.createTestimonial = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { avatarUrl, quote, name, role, city, rating } = req.body;

        const testimonial = await Testimonial.create({
            avatarUrl,
            quote,
            name,
            role,
            city,
            rating,
        });

        return res.status(successCode).json({
            message: "Testimonial created successfully",
            data: testimonial,
        });
    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Get All Testimonials (Public) */
exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.status(successCode).json({
            data: testimonials,
        });
    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Get Single Testimonial */
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(notFoundCode).json({
                error: "Testimonial not found",
            });
        }

        return res.status(successCode).json({
            data: testimonial,
        });
    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Delete Testimonial (Admin) */
exports.deleteTestimonial = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(notFoundCode).json({
                error: "Testimonial not found",
            });
        }

        await testimonial.destroy();

        return res.status(successCode).json({
            message: "Testimonial deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};