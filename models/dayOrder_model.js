const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DayOrder = sequelize.define("DayOrder", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    dayOrder: {
        type: DataTypes.ENUM("A", "B", "C", "D", "E", "F"),
        allowNull: false
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
    },

    isWorkingDay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    reason: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = DayOrder;