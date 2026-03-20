const OnlineConsultation = require("../models/OnlineConsultation");
const {
    successCode,
    badGatewayCode,
    notFoundCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/** Create Consultation (Public) */
exports.createConsultation = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            courseInterest,
            preferredStateCity,
            preferredConsultationDate,
            preferredTime,
            message,
            sourcePage,
        } = req.body;

        if (!fullName || !email || !phone || !courseInterest) {
            return res.status(400).json({
                error: "Required fields missing",
            });
        }

        const consultation = await OnlineConsultation.create({
            fullName,
            email,
            phone,
            courseInterest,
            preferredStateCity,
            preferredConsultationDate,
            preferredTime,
            message,
            sourcePage,
        });

        return res.status(successCode).json({
            message: "Consultation request submitted successfully",
            data: consultation,
        });

    } catch (error) {
        console.error("Create consultation error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Get All (Admin) */
exports.getAllConsultations = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const data = await OnlineConsultation.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(successCode).json({
            total: data.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(data.count / limit),
            data: data.rows,
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Get Single */
exports.getConsultationById = async (req, res) => {
    try {
        const consultation = await OnlineConsultation.findByPk(req.params.id);

        if (!consultation) {
            return res.status(notFoundCode).json({
                error: "Consultation not found",
            });
        }

        return res.status(successCode).json({
            data: consultation,
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/** Delete (Admin) */
exports.deleteConsultation = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const consultation = await OnlineConsultation.findByPk(req.params.id);

        if (!consultation) {
            return res.status(notFoundCode).json({
                error: "Consultation not found",
            });
        }

        await consultation.destroy();

        return res.status(successCode).json({
            message: "Deleted successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};