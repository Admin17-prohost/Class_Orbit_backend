const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Timetable = sequelize.define("Timetable", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    day: {
        type: DataTypes.ENUM("A", "B", "C", "D", "E", "F"),
        allowNull: false
    },

    period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },

    startTime: {
        type: DataTypes.TIME,
        allowNull: true
    },

    endTime: {
        type: DataTypes.TIME,
        allowNull: true
    },

    classID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "classLogins",
            key: "id"
        }
    },

    subjectID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "subjects",
            key: "id"
        }
    },

    staffID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "staffs",
            key: "id"
        }
    },

    departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "departments",
            key: "id"
        }
    }

}, {
    indexes: [
        {
            unique: true,
            fields: ["classID", "day", "period"],
            name: "unique_class_day_period"
        },
        {
            unique: true,
            fields: ["staffID", "day", "period"],
            name: "unique_staff_day_period"
        }
    ]
});

module.exports = Timetable;