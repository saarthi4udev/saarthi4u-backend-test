const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mentor = sequelize.define(
    "Mentor",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        profileImage: {
            type: DataTypes.STRING,
        },

        title: {
            type: DataTypes.STRING, // Economics, Law & Management Mentor
        },

        role: {
            type: DataTypes.STRING, // Senior Advisor
        },

        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },

        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        description: {
            type: DataTypes.TEXT,
        },

        qualifications: {
            type: DataTypes.TEXT, // full paragraph
        },

        shortQualifications: {
            type: DataTypes.JSON, // ["PhD Economics", "LLM"]
        },

        experienceYears: {
            type: DataTypes.INTEGER,
        },

        studentsGuided: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
);

module.exports = Mentor;