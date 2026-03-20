const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Testimonial = sequelize.define(
    "Testimonial",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        quote: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },

        deletedAt: DataTypes.DATE,
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Testimonial;