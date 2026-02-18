const Gallery = require("../models/Gallery");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

exports.createGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(successCode).json({ data: item });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.getGalleryByCollege = async (req, res) => {
  try {
    const items = await Gallery.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
    });

    res.status(successCode).json({ data: items });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(notFoundCode).json({ error: "Not found" });

    await item.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
