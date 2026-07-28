const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const department = Sequelize.define("department",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
});

module.exports = department;