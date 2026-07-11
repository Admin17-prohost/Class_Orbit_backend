const { DataTypes } = require("Sequelize");
const sequelize = require("../config/db");

const department = sequelize.define("department",{
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
    hodID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "hods",
            key: "id"
        }
    }


});

module.exports = department;