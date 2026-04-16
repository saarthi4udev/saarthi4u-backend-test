const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HomepageSection = sequelize.define("HomepageSection", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    header: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    tags: {
        type: DataTypes.JSON, // ["tag1", "tag2"]
        allowNull: true,
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    timestamps: true,
});

module.exports = HomepageSection;