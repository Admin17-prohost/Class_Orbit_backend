const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const HOD = require("../models/HOD");
const Staff = require("../models/Staff");

const getRoleByEmail = (email) => {
  if (email.includes("hod")) return "hod";
  if (email.includes("staff") || email.includes("ravi") || email.includes("kumar")) return "staff";
  return "user";
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Register API is only for admin creation",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
      department,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = null;
    let role = null;

    const emailType = getRoleByEmail(email);

    if (emailType === "hod") {
      account = await HOD.findOne({ where: { email } });
      role = "hod";
    } else if (emailType === "staff") {
      account = await Staff.findOne({ where: { email } });
      role = "staff";
    } else {
      account = await User.findOne({ where: { email } });
      role = account?.role;
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.status !== "active") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: account.id,
        role,
        department: account.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role,
        department: account.department,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};