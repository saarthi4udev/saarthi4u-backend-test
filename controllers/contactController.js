const Contact = require("../models/Contact");
const {
    successCode,
    badGatewayCode,
    notFoundCode,
} = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/**
 * Submit Contact Form (Public)
 */
exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, message, courseInterest, preferredLocation } = req.body;

        if (!name || !email || !subject || !message || !courseInterest || !preferredLocation) {
            return res.status(400).json({
                error: "All fields including course interest and preferred location are required",
            });
        }

        const contact = await Contact.create(req.body);

        return res.status(successCode).json({
            message: "Your message has been submitted successfully",
            data: contact,
        });

    } catch (error) {
        console.error("Create contact error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Get All Contacts (Admin only)
 */
exports.getAllContacts = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const contacts = await Contact.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        return res.status(successCode).json({
            total: contacts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(contacts.count / limit),
            data: contacts.rows,
        });

    } catch (error) {
        console.error("Get contacts error:", error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Get Single Contact (Admin only)
 */
exports.getContactById = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(notFoundCode).json({
                error: "Contact not found",
            });
        }

        return res.status(successCode).json({
            data: contact,
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};

/**
 * Delete Contact (Admin only – soft delete)
 */
exports.deleteContact = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(notFoundCode).json({
                error: "Contact not found",
            });
        }

        await contact.destroy();

        return res.status(successCode).json({
            message: "Contact deleted successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(badGatewayCode).json({
            error: "Server error",
        });
    }
};