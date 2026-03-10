const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define(
    "Contact",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        phone: DataTypes.STRING,

        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        deletedAt: DataTypes.DATE,
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Contact;