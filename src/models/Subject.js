const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subjectCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subjectType: {
      type: DataTypes.ENUM("theory", "practical", "skill"),
      allowNull: false,
      defaultValue: "theory",
    },

    weeklyHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    semester: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = Subject;