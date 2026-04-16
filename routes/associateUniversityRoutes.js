const express = require("express");
const { body, param } = require("express-validator");

const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const multer = require("multer");
const { createAssociateUniversity, getAllAssociateUniversitys, deleteAssociateUniversity } = require("../controllers/associateUniversityController");

const upload = multer({ dest: "uploads/temp/" });
const router = express.Router();

/** Create Associate University */
router.post(
    "/create",
    verifyToken,
    loggerMiddleware,
    upload.single("pdfUrl"),
    [
        body("name").notEmpty().withMessage("Name is required"),
    ],
    createAssociateUniversity
);

/** Get All Associate Universities (Public) */
router.get("/all", loggerMiddleware,
    getAllAssociateUniversitys);


/** Delete Associate University */
router.delete(
    "/delete/:id",
    verifyToken,
    loggerMiddleware,
    [param("id").isUUID()],
    deleteAssociateUniversity
);

module.exports = router;