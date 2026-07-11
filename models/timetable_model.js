const { DataTypes } = require("Sequelize");
const sequelize = require("../config/db");

const timetable = sequelize.define("timetable",{
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