const cloudinary = require("cloudinary").v2;
const path = require("node:path");
require("dotenv").config();
const config = {
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API,
        apiSecret: process.env.API_SECRET,
    },
};

const storeImage = async (imagePath, displayName, folderName) => {
    cloudinary.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
    });

    const cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
        public_id: `${folderName}/${Date.now()}-${path
            .basename(displayName)
            .replace(/\.[^/.]+$/, "") // strip any extension
            .replace(/\s+/g, "-")}`,
        use_filename: true,
        tags: [folderName, "image"],
        access_mode: "public",
    });

    return {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
    };
};


module.exports = {
    storeImage,
};
