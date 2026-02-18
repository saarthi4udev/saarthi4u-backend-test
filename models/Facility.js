const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Facility = sequelize.define(
  "Facility",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Facility;
