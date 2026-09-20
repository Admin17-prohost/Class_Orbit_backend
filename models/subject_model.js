const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const subject = Sequelize.define("subject", {

    // Subject ID
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Subject Name
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Subject Code
    subject_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Semester
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    // Department
    departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "departments",
            key: "id"
        }
    },

    // Assigned Staff
    staffID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "staffs",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    },

    // Weekly Periods
    weeklyPeriods: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 10
        }
    }

});

module.exports = subject;