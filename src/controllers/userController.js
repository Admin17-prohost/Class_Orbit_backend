const User = require("../models/User");

const allowedRoles = ["official", "student"];

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, status } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Only official and student users can be created here",
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
      role,
      department,
      status,
    });

    const safeUser = user.toJSON();
    delete safeUser.password;

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: allowedRoles,
      },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, department, status } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Only official/student roles allowed",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Email already used" });
      }
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      role: role || user.role,
      department: department || user.department,
      status: status || user.status,
    });

    const safeUser = user.toJSON();
    delete safeUser.password;

    res.json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};