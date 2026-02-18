const Admission = require("../models/Admission");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/** Create Admission (Admin) */
exports.createAdmission = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const admission = await Admission.create(req.body);
    res.status(successCode).json({ data: admission });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Get Admissions by College */
exports.getAdmissionsByCollege = async (req, res) => {
  try {
    const admissions = await Admission.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data: admissions });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Delete Admission */
exports.deleteAdmission = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const item = await Admission.findByPk(req.params.id);
    if (!item) return res.status(notFoundCode).json({ error: "Not found" });

    await item.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
