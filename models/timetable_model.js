const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const timetable = Sequelize.define("timetable",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    period: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
     year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
     semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    staffID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "staffs",
            key: "id"
        }
    }
    ,
    subjectID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "subjects",
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
});

module.exports = timetable;