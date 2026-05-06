const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    roomType: {
      type: DataTypes.ENUM("classroom", "lab", "seminar"),
      allowNull: false,
      defaultValue: "classroom",
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    department: {
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

module.exports = Room;