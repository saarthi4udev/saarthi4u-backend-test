const Category = require("../models/Category");
const College = require("../models/College");
const Course = require("../models/Course");
const Fee = require("../models/Fee");
const Admission = require("../models/Admission");
const Placement = require("../models/Placement");
const Recruiter = require("../models/Recruiter");
const Facility = require("../models/Facility");
const Faculty = require("../models/Faculty");
const Review = require("../models/Review");
const Gallery = require("../models/Gallery");
const FAQ = require("../models/FAQ");
const User = require("../models/User");
const Cutoff = require("../models/Cutoff");

// Category → College
Category.hasMany(College, { foreignKey: "categoryId" });
College.belongsTo(Category, { foreignKey: "categoryId" });

// College relations
College.hasMany(Course, { foreignKey: "collegeId" });
College.hasMany(Admission, { foreignKey: "collegeId" });
College.hasMany(Placement, { foreignKey: "collegeId" });
College.hasMany(Facility, { foreignKey: "collegeId" });
College.hasMany(Faculty, { foreignKey: "collegeId" });
College.hasMany(Review, { foreignKey: "collegeId" });
College.hasMany(Gallery, { foreignKey: "collegeId" });
College.hasMany(FAQ, { foreignKey: "collegeId" });
College.hasMany(Recruiter, { foreignKey: "collegeId" });
College.hasMany(Cutoff, { foreignKey: "collegeId" });

// Reverse relations
Course.belongsTo(College, { foreignKey: "collegeId" });
Admission.belongsTo(College, { foreignKey: "collegeId" });
Placement.belongsTo(College, { foreignKey: "collegeId" });
Facility.belongsTo(College, { foreignKey: "collegeId" });
Faculty.belongsTo(College, { foreignKey: "collegeId" });
Review.belongsTo(College, { foreignKey: "collegeId" });
Gallery.belongsTo(College, { foreignKey: "collegeId" });
FAQ.belongsTo(College, { foreignKey: "collegeId" });
Recruiter.belongsTo(College, { foreignKey: "collegeId" });
Cutoff.belongsTo(College, { foreignKey: "collegeId" });

// Course → Fee
Course.hasMany(Fee, { foreignKey: "courseId" });
Fee.belongsTo(Course, { foreignKey: "courseId" });

module.exports = {
  Category,
  College,
  Course,
  Fee,
  Admission,
  Placement,
  Recruiter,
  Facility,
  Faculty,
  Review,
  Gallery,
  FAQ,
  User,
};
