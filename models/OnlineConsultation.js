const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OnlineConsultation = sequelize.define(
    "OnlineConsultation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        courseInterest: {
            type: DataTypes.ENUM(
                "engineering",
                "medical",
                "management",
                "law",
                "arts",
                "other"
            ),
            allowNull: false,
        },

        preferredStateCity: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        preferredConsultationDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        preferredTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        sourcePage: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "/contact",
        },

        deletedAt: DataTypes.DATE,
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = OnlineConsultation;