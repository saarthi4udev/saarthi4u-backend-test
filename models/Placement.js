const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Placement = sequelize.define(
  "Placement",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    highestPackage: DataTypes.STRING,
    averagePackage: DataTypes.STRING,
    placementRate: DataTypes.STRING,
    totalPlaced: DataTypes.INTEGER,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Placement;
