const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admission = sequelize.define(
  "Admission",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    process: DataTypes.TEXT,
    eligibility: DataTypes.TEXT,
    entranceExams: DataTypes.STRING,
    importantDates: DataTypes.JSON,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Admission;
