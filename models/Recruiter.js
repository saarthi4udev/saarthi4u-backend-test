const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recruiter = sequelize.define(
  "Recruiter",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Recruiter;
