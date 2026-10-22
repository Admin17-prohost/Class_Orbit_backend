const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Calendar = sequelize.define(
  "calendar",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM("WORKING", "HOLIDAY"),
      allowNull: false,
      defaultValue: "WORKING",
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "calendars",
  }
);

module.exports = Calendar;