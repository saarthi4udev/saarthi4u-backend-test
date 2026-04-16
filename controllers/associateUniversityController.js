const AssociateUniversity = require("../models/AssociateUniversity");
const fs = require("node:fs");
const { storeImage } = require("../helpers/cloudinary");

const isAdmin = (req) => req.user?.role === "admin";

// Create AssociateUniversity (Admin)
exports.createAssociateUniversity = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { name } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "PDF file is required" });
        }

        const upload = await storeImage(
            req.file.path,
            `AssociateUniversity_${name}`,
            "AssociateUniversitys"
        );

        fs.unlinkSync(req.file.path);

        const doc = await AssociateUniversity.create({
            name,
            pdfUrl: upload.url,
        });

        res.json({
            message: "AssociateUniversity uploaded",
            data: doc,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All AssociateUniversitys (Public)
exports.getAllAssociateUniversitys = async (req, res) => {
    try {
        const docs = await AssociateUniversity.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.json({ data: docs });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete AssociateUniversity (Admin)
exports.deleteAssociateUniversity = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const doc = await AssociateUniversity.findByPk(req.params.id);

        if (!doc) {
            return res.status(404).json({ error: "AssociateUniversity not found" });
        }

        await doc.destroy();

        res.json({ message: "AssociateUniversity deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};