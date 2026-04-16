const HomeSection = require("../models/HomeSection");
const fs = require("node:fs");
const { storeImage } = require("../helpers/cloudinary");

const isAdmin = (req) => req.user?.role === "admin";

// Create Home Section (Admin)
exports.createSection = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const exists = await HomeSection.findOne();

        if (exists) {
            return res.status(400).json({
                error: "Section already exists. Use update.",
            });
        }

        let imageUrl = null;

        if (req.file) {
            const upload = await storeImage(
                req.file.path,
                "section",
                "section_data"
            );
            imageUrl = upload.url;
            fs.unlinkSync(req.file.path);
        }

        const section = await HomeSection.create({
            ...req.body,
            imageUrl,
        });

        res.json({ data: section });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Home Section (Admin)
exports.updateSection = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const section = await HomeSection.findOne();

        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }

        let imageUrl = section.imageUrl;

        if (req.file) {
            const upload = await storeImage(
                req.file.path,
                "section",
                "section_data"
            );
            imageUrl = upload.url;
            fs.unlinkSync(req.file.path);
        }

        await section.update({
            ...req.body,
            imageUrl,
        });

        res.json({ data: section });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Home Section (Public)
exports.getSection = async (req, res) => {
    const section = await HomeSection.findOne();
    res.json({ data: section });
};