const Fee = require("../models/Fee");
const Course = require("../models/Course");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

const isAdmin = (req) => req.user?.role === "admin";

/** Create Fee */
exports.createFee = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const fee = await Fee.create(req.body);
    res.status(successCode).json({ data: fee });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Get Fees by Course */
exports.getFeesByCourse = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      where: { courseId: req.params.courseId },
      include: Course,
    });

    res.status(successCode).json({ data: fees });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Delete Fee */
exports.deleteFee = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: "Access denied" });

    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(notFoundCode).json({ error: "Not found" });

    await fee.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
