const Facility = require("../models/Facility");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

exports.createFacility = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const facility = await Facility.create(req.body);
    res.status(successCode).json({ data: facility });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.getFacilitiesByCollege = async (req, res) => {
  try {
    const data = await Facility.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.deleteFacility = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const item = await Facility.findByPk(req.params.id);
    if (!item) return res.status(notFoundCode).json({ error: "Not found" });

    await item.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
