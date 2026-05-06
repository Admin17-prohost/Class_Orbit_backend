const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    departmentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    hodName: {
      type: DataTypes.STRING,
      allowNull: true,
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

module.exports = Department;