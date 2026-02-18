const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FAQ = sequelize.define(
  "FAQ",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
  },
  {paranoid:true, timestamps: true }
);

module.exports = FAQ;
