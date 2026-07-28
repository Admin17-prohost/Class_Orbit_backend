const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const subject = Sequelize.define("subject",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject_name: {
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
        allowNull: true
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
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    }
});

module.exports = subject;