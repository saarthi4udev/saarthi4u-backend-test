const Carousel = require("../models/Carousel");
const fs = require("node:fs");
const { storeImage } = require("../helpers/cloudinary");

const isAdmin = (req) => req.user?.role === "admin";

// Create Carousel Item (Admin)
exports.createCarousel = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { title, description, rank } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Image required" });
        }

        const upload = await storeImage(
            req.file.path,
            `carousel_${title}`,
            "carousel_data"
        );

        fs.unlinkSync(req.file.path);

        // 🔍 Check if rank already exists
        const existing = await Carousel.findOne({ where: { rank } });

        if (existing) {
            // Step 1: Move existing to temp rank
            await existing.update({ rank: -1 }); // temporary safe value
        }

        // Step 2: Create new with desired rank
        const data = await Carousel.create({
            title,
            description,
            rank,
            imageUrl: upload.url,
        });

        if (existing) {
            // Step 3: Assign new rank to old item (e.g., last rank)
            const maxRank = await Carousel.max("rank");

            await existing.update({ rank: maxRank + 1 });
        }

        res.json({ success: true, data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Active Carousel Items (Public)
exports.getAllCarousel = async (req, res) => {
    const data = await Carousel.findAll({
        where: { isActive: true },
        order: [["rank", "ASC"]],
    });

    res.json({ data });
};

// Delete Carousel Item (Admin)
exports.deleteCarousel = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: "Access denied" });
        }
        const { id } = req.params;

        const item = await Carousel.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "Carousel item not found" });
        }
        await item.destroy();

        res.json({ success: true, message: "Carousel item deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};