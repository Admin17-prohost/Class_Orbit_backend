const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    collegeName: {
      type: DataTypes.STRING,
      defaultValue: "Class Orbit College",
    },

    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    timetableMode: {
      type: DataTypes.ENUM("weekly", "cycle"),
      defaultValue: "weekly",
    },

    workingDays: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },

    periodsPerDay: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },

    breakPeriods: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    defaultDocumentVisibility: {
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

module.exports = Setting;