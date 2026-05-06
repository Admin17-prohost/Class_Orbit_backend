const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SubjectAllocation = sequelize.define(
  "SubjectAllocation",
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

    subjectType: {
      type: DataTypes.ENUM("theory", "practical", "skill"),
      allowNull: false,
    },

    weeklyHours: {
      type: DataTypes.INTEGER,
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

module.exports = SubjectAllocation;