const Recruiter = require("../models/Recruiter");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

/** Create Recruiter */
exports.createRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.create(req.body);
        res.status(successCode).json({ data: recruiter });
    } catch (error) {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/** Get Recruiters by College */
exports.getRecruitersByCollege = async (req, res) => {
    try {
        const recruiters = await Recruiter.findAll({
            where: { collegeId: req.params.collegeId },
            include: College,
            order: [["createdAt", "DESC"]],
        });

        res.status(successCode).json({ data: recruiters });
    } catch (error) {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};

/** Delete Recruiter (Admin optional) */
exports.deleteRecruiter = async (req, res) => {
    try {
        const recruiter = await Recruiter.findByPk(req.params.id);
        if (!recruiter) return res.status(notFoundCode).json({ error: "Not found" });

        await recruiter.destroy();
        res.status(successCode).json({ message: "Deleted" });
    } catch (error) {
        res.status(badGatewayCode).json({ error: "Server error" });
    }
};
