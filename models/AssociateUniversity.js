const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AssociateUniversity = sequelize.define("AssociateUniversity", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    pdfUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    deletedAt: DataTypes.DATE,
}, {
    paranoid: true,
    timestamps: true,
});

module.exports = AssociateUniversity;