const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Timetable = sequelize.define("Timetable", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Day Order
    day: {
        type: DataTypes.ENUM("A", "B", "C", "D", "E", "F"),
        allowNull: false
    },

    // Period Number
    period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },

    // Period Start Time
    startTime: {
        type: DataTypes.TIME,
        allowNull: true
    },

    // Period End Time
    endTime: {
        type: DataTypes.TIME,
        allowNull: true
    },

    // Class
    classID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "classLogins",
            key: "id"
        }
    },

    // Subject
    subjectID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "subjects",
            key: "id"
        }
    },

    // Staff
    staffID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "staffs",
            key: "id"
        }
    },

    // Department
    departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "departments",
            key: "id"
        }
    }
});

module.exports = Timetable;