const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carousel = sequelize.define("Carousel", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

    deletedAt: DataTypes.DATE,
}, {
    paranoid: true,
    timestamps: true,
});

module.exports = Carousel;