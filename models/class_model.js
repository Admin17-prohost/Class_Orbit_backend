const { DataTypes } = require("Sequelize");
const sequelize = require("../config/db");

const classLogin = sequelize.define("classLogin",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
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
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "departments",
            key: "id"
        }
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "STUDENT"
    }
})

module.exports = classLogin;