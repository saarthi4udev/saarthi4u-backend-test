const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Exam = sequelize.define(
    "Exam",
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
        },

        shortName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        level: {
            type: DataTypes.ENUM("national", "state", "university", "international"),
            allowNull: false,
        },

        examMode: {
            type: DataTypes.ENUM("online", "offline", "hybrid"),
            allowNull: false,
        },

        examType: {
            type: DataTypes.ENUM("entrance", "eligibility", "scholarship"),
            allowNull: false,
        },

        conductingBody: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        frequency: {
            type: DataTypes.STRING, // yearly, twice a year etc.
        },

        duration: {
            type: DataTypes.STRING, // 3 hours, 2 papers etc.
        },

        totalMarks: {
            type: DataTypes.INTEGER,
        },

        applicationFee: {
            type: DataTypes.STRING,
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

        examPattern: {
            type: DataTypes.TEXT,
        },

        syllabus: {
            type: DataTypes.TEXT,
        },

        importantDates: {
            type: DataTypes.JSON,
            // { applicationStart: "", applicationEnd: "", examDate: "", resultDate: "" }
        },

        applicationProcess: {
            type: DataTypes.TEXT,
        },

        admitCardDetails: {
            type: DataTypes.TEXT,
        },

        resultDetails: {
            type: DataTypes.TEXT,
        },

        cutoffDetails: {
            type: DataTypes.TEXT,
        },

        counsellingDetails: {
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

module.exports = Exam;