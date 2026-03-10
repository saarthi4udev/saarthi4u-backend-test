const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const News = sequelize.define(
    "News",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        summary: DataTypes.TEXT,

        content: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        featuredImage: DataTypes.STRING,

        source: DataTypes.STRING, // Example: PTI, ANI, Official Website

        metaTitle: DataTypes.STRING,
        metaDescription: DataTypes.TEXT,
        metaKeywords: DataTypes.STRING,

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        isBreaking: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        publishedAt: DataTypes.DATE,

        deletedAt: DataTypes.DATE,
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = News;