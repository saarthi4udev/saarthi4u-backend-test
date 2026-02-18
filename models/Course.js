const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
  "Course",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    specialization: DataTypes.STRING,
    duration: DataTypes.STRING,
    totalSeats: DataTypes.INTEGER,

    level: DataTypes.ENUM("UG", "PG", "Diploma", "PhD"),
  },
  {paranoid:true, timestamps: true }
);

module.exports = Course;
