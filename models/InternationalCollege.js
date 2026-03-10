const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InternationalCollege = sequelize.define(
    "InternationalCollege",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [3, 255] },
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
        },

        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = InternationalCollege;