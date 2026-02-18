const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Faculty = sequelize.define(
  "Faculty",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    designation: DataTypes.STRING,
    qualification: DataTypes.STRING,
    experience: DataTypes.STRING,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Faculty;
