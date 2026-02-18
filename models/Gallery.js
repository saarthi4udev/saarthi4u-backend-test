const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gallery = sequelize.define(
  "Gallery",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    collegeId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    caption: DataTypes.STRING,
  },
  { timestamps: true }
);

module.exports = Gallery;
