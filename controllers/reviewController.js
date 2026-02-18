const Review = require("../models/Review");
const College = require("../models/College");
const { successCode, notFoundCode, badGatewayCode } = require("../config/statuscodes");

/** Create Review */
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(successCode).json({ data: review });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Get Reviews by College */
exports.getReviewsByCollege = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { collegeId: req.params.collegeId },
      include: College,
      order: [["createdAt", "DESC"]],
    });

    res.status(successCode).json({ data: reviews });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

/** Delete Review (Admin optional) */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(notFoundCode).json({ error: "Not found" });

    await review.destroy();
    res.status(successCode).json({ message: "Deleted" });
  } catch {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
