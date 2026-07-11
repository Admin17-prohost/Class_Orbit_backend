const { DataTypes } = require("Sequelize");
const sequelize = require("../config/db");

const admin = sequelize.define("admin",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
    , name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
    , username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
    , password:{
        type: DataTypes.STRING,
        allowNull: false
        
    }
    , role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "ADMIN",
}
    
});

module.exports = admin;