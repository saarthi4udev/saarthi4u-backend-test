const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    comment: DataTypes.TEXT,
  },
  {paranoid:true, timestamps: true }
);

module.exports = Review;
