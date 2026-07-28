const {DataTypes} = require("sequelize");
const Sequelize = require("../config/db");

const staff = Sequelize.define("staff",{
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
    subjectID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "subjects",
            key: "id"
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "staff"
    }
});

module.exports = staff;