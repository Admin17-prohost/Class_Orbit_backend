const { DataTypes } = require("Sequelize");
const sequelize = require("../config/db");

const subject = sequelize.define("subject",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    departmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "departments",
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
    }
});

module.exports = subject;