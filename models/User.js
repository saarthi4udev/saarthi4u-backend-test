const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
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
        len: [3, 50],
      },
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    firebaseUid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    authProvider: {
      type: DataTypes.ENUM("local", "google", "facebook", "phone"),
      allowNull: false,
      defaultValue: "local",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      set(value) {
        this.setDataValue("role", value.toLowerCase());
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },

    paranoid: true, // Enables soft deletion
    timestamps: true, // Required for paranoid mode
  }
);

// Static method to fetch users by role
User.fetchByRole = async function (role) {
  const condition = role ? { role: role.toLowerCase() } : {};
  return await User.findAll({
    where: {
      ...condition,
      deletedAt: null, // fetch only non-deleted users
    },
    order: [["createdAt", "DESC"]],
  });
};

module.exports = User;
