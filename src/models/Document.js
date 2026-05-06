const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    uploadedRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    visibility: {
      type: DataTypes.ENUM("admin", "hod", "staff", "official", "student", "all"),
      defaultValue: "all",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Document;