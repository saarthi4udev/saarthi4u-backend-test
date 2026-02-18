const Course = require("../models/Course");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

exports.createCourse = async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

        const course = await Course.create(req.body);
        res.status(successCode).json({ data: course });
    } catch {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({ include: College });
        res.status(successCode).json({ data: courses });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, { include: College });
        if (!course) return res.status(notFoundCode).json({ error: "Not found" });
        res.status(successCode).json({ data: course });
    } catch {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(notFoundCode).json({ error: "Not found" });

        await course.update(req.body);
        res.status(successCode).json({ data: course });
    } catch {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(notFoundCode).json({ error: "Not found" });

        await course.destroy();
        res.status(successCode).json({ message: "Deleted" });
    } catch {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};
