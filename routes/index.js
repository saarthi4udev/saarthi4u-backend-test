// Import all routes
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const admissionRoutes = require("./admissionRoutes");
const collegeRoutes = require("./collegeRoutes");
const cutoffRoutes = require("./cutoffRoutes");
const facilityRoutes = require("./facilityRoutes");
const facultyRoutes = require("./facultyRoutes");
const faqRoutes = require("./faqRoutes");
const feeRoutes = require("./feeRoutes");
// const placementRoutes = require("./placementRoutes");
// const recruiterRoutes = require("./recruiterRoutes");
const reviewRoutes = require("./reviewRoutes");
// const galleryRoutes = require("./galleryRoutes");

const index = (app) => {

  // Register all routes
  app.use("/api/auth", authRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/admission", admissionRoutes);
  app.use("/api/college", collegeRoutes);
  app.use("/api/cutoff", cutoffRoutes);
  app.use("/api/facility", facilityRoutes);
  app.use("/api/faculty", facultyRoutes);
  app.use("/api/faq", faqRoutes);
  app.use("/api/fee", feeRoutes);
  // app.use("/api/placement", placementRoutes);
  // app.use("/api/recruiter", recruiterRoutes);
  app.use("/api/review", reviewRoutes);
  // app.use("/api/gallery", galleryRoutes);

  // 404 handler - must be after all routes
  app.all("*", (req, res) => {
    const logger = require("../config/logger");
    logger.warn(`Route not found: ${req.originalUrl}`);
    res.status(404).json({
      status: "fail",
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  });

  return app;
};

module.exports = index;
