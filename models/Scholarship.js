const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Scholarship = sequelize.define(
    "Scholarship",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [3, 255] },
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        shortName: {
            type: DataTypes.STRING,
        },

        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        scholarshipType: {
            type: DataTypes.ENUM("government", "private", "international", "university"),
            allowNull: false,
        },

        level: {
            type: DataTypes.ENUM("school", "ug", "pg", "phd"),
            allowNull: false,
        },

        amount: {
            type: DataTypes.STRING,
        },

        applicationMode: {
            type: DataTypes.ENUM("online", "offline"),
        },

        officialWebsite: {
            type: DataTypes.STRING,
        },

        overview: {
            type: DataTypes.TEXT,
        },

        eligibility: {
            type: DataTypes.TEXT,
        },

        benefits: {
            type: DataTypes.TEXT,
        },

        importantDates: {
            type: DataTypes.JSON,
            // { applicationStart: "", applicationEnd: "", resultDate: "" }
        },

        applicationProcess: {
            type: DataTypes.TEXT,
        },

        documentsRequired: {
            type: DataTypes.TEXT,
        },

        selectionProcess: {
            type: DataTypes.TEXT,
        },

        renewalProcess: {
            type: DataTypes.TEXT,
        },

        metaTitle: DataTypes.STRING,
        metaKeywords: DataTypes.TEXT,
        metaDescription: DataTypes.TEXT,

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Scholarship;