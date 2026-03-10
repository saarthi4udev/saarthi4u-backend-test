const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Blog = sequelize.define(
    "Blog",
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

        excerpt: DataTypes.TEXT,

        content: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        featuredImage: DataTypes.STRING,

        metaTitle: DataTypes.STRING,
        metaDescription: DataTypes.TEXT,
        metaKeywords: DataTypes.STRING,

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        isFeatured: {
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
        paranoid: true, // enables soft delete
        timestamps: true,
    }
);

module.exports = Blog;