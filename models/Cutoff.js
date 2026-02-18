const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cutoff = sequelize.define(
    "Cutoff",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        collegeId: DataTypes.INTEGER,
        courseName: DataTypes.STRING,
        exam: DataTypes.STRING,
        year: DataTypes.INTEGER,
        closingRank: DataTypes.STRING,
    },
    { paranoid: true, timestamps: true }
);

module.exports = Cutoff;
