const FAQ = require("../models/FAQ");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

exports.createFAQ = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const faq = await FAQ.create(req.body);
    res.status(successCode).json({ data: faq });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.getFAQsByCollege = async (req, res) => {
  try {
    const data = await FAQ.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const item = await FAQ.findByPk(req.params.id);
    if (!item) return res.status(notFoundCode).json({ error: "Not found" });

    await item.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
