const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const College = sequelize.define(
    "College",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [3, 255] },
        },

        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        shortName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        type: {
            type: DataTypes.ENUM("college", "university"),
            allowNull: false,
        },

        establishedYear: DataTypes.INTEGER,
        affiliation: DataTypes.STRING,
        approvedBy: DataTypes.STRING,
        accreditation: DataTypes.STRING,
        campusSize: DataTypes.STRING,

        address: DataTypes.TEXT,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: { type: DataTypes.STRING, defaultValue: "India" },

        overview: DataTypes.TEXT,
        vision: DataTypes.TEXT,
        mission: DataTypes.TEXT,
        history: DataTypes.TEXT,

        metaTitle: DataTypes.STRING,
        metaKeywords: DataTypes.TEXT,
        metaDescription: DataTypes.TEXT,

        visible: { type: DataTypes.BOOLEAN, defaultValue: true, },
    },
    { paranoid: true, timestamps: true }
);

module.exports = College;
