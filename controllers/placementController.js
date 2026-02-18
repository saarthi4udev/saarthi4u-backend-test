const Placement = require("../models/Placement");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

exports.createPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);
    res.status(successCode).json({ data: placement });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.getPlacementsByCollege = async (req, res) => {
  try {
    const placements = await Placement.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data: placements });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByPk(req.params.id);
    if (!placement) return res.status(notFoundCode).json({ error: "Not found" });

    await placement.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
