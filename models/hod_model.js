const { DataTypes} = require("Sequelize");
const sequelize = require("../config/db");

const hod = sequelize.define("hod",{
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
        defaultValue: "hod"
    }
});

module.exports = hod;
