const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notification = sequelize.define(
  "Notification",
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

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    targetRole: {
      type: DataTypes.ENUM(
        "admin",
        "hod",
        "staff",
        "official",
        "student",
        "all"
      ),
      defaultValue: "all",
    },

    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    type: {
      type: DataTypes.ENUM(
        "class_alert",
        "timetable_update",
        "document_upload",
        "general"
      ),
      defaultValue: "general",
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

module.exports = Notification;