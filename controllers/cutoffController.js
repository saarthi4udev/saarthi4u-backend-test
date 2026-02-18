const Cutoff = require("../models/Cutoff");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

exports.createCutoff = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const cutoff = await Cutoff.create(req.body);
    res.status(successCode).json({ data: cutoff });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.getCutoffsByCollege = async (req, res) => {
  try {
    const data = await Cutoff.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.deleteCutoff = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const item = await Cutoff.findByPk(req.params.id);
    if (!item) return res.status(notFoundCode).json({ error: "Not found" });

    await item.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
