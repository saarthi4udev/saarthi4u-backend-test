const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fee = sequelize.define(
    "Fee",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        year: DataTypes.STRING, // 1st Year, 2nd Year
        tuitionFee: DataTypes.INTEGER,
        hostelFee: DataTypes.INTEGER,
        examFee: DataTypes.INTEGER,
        otherFee: DataTypes.INTEGER,
        totalFee: DataTypes.INTEGER,
    },
    { paranoid: true, timestamps: true }
);

module.exports = Fee;
