const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");

const HOD = sequelize.define(
  "HOD",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,

    hooks: {
      beforeCreate: async (hod) => {
        const salt = await bcrypt.genSalt(10);
        hod.password = await bcrypt.hash(hod.password, salt);
      },

      beforeUpdate: async (hod) => {
        if (hod.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          hod.password = await bcrypt.hash(hod.password, salt);
        }
      },
    },
  }
);

module.exports = HOD;