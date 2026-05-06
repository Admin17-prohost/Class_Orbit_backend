const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ClassRoom = sequelize.define(
  "ClassRoom",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    section: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "A",
    },

    classRoom: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    classIncharge: {
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

module.exports = ClassRoom;