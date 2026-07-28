const { DataTypes} = require("sequelize");
const Sequelize = require("../config/db");

const hod = Sequelize.define("hod",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
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
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "HOD"
    }
});

module.exports = hod;
