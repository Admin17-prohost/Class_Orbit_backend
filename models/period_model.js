const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Period = sequelize.define("Period", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    periodNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            min: 1,
            max: 10
        }
    },

    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },

    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },

    isBreak: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = Period;