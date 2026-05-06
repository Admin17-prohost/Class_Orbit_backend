const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Timetable = sequelize.define(
  "Timetable",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    staffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    timetableMode: {
      type: DataTypes.ENUM("weekly", "cycle"),
      allowNull: false,
      defaultValue: "weekly",
    },

    day: {
      type: DataTypes.STRING,
      allowNull: false,
      // weekly: MON, TUE, WED...
      // cycle: A, B, C, D...
    },

    period: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subjectType: {
      type: DataTypes.ENUM("theory", "practical", "skill"),
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

module.exports = Timetable;