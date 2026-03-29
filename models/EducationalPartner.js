const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EducationalPartner = sequelize.define(
    "EducationalPartner",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING,
            unique: true,
        },

        image: {
            type: DataTypes.STRING,
        },

        description: {
            type: DataTypes.TEXT,
        },

        services: {
            type: DataTypes.STRING, // "UG and PG admission guidance"
        },

        tag: {
            type: DataTypes.STRING, // "Verified Partner"
        },

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
);

module.exports = EducationalPartner;