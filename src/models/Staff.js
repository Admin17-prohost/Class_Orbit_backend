const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");

const Staff = sequelize.define(
  "Staff",
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
    },

    designation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Assistant Professor",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,

    hooks: {
      beforeCreate: async (staff) => {
        const salt = await bcrypt.genSalt(10);
        staff.password = await bcrypt.hash(staff.password, salt);
      },

      beforeUpdate: async (staff) => {
        if (staff.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          staff.password = await bcrypt.hash(staff.password, salt);
        }
      },
    },
  }
);

module.exports = Staff;