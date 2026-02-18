const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    paranoid: true,      // soft delete
    timestamps: true,    // createdAt, updatedAt
  }
);

// Fetch all visible categories (for public users)
Category.fetchVisible = async function () {
  return await Category.findAll({
    where: {
      visible: true,
      deletedAt: null,
    },
    order: [["createdAt", "DESC"]],
  });
};

module.exports = Category;
