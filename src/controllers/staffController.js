const Staff = require("../models/Staff");

exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, status } = req.body;

    const existingStaff = await Staff.findOne({ where: { email } });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff email already exists" });
    }

    const staff = await Staff.create({
      name,
      email,
      password,
      phone,
      department,
      designation,
      status,
    });

    const safeStaff = staff.toJSON();
    delete safeStaff.password;

    res.status(201).json({
      message: "Staff created successfully",
      staff: safeStaff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create staff",
      error: error.message,
    });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Staff fetched successfully",
      count: staff.length,
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: "Staff fetched successfully",
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, status } = req.body;

    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (email && email !== staff.email) {
      const existingStaff = await Staff.findOne({ where: { email } });
      if (existingStaff) {
        return res.status(400).json({ message: "Email already used" });
      }
    }

    await staff.update({
      name: name || staff.name,
      email: email || staff.email,
      password: password || staff.password,
      phone: phone || staff.phone,
      department: department || staff.department,
      designation: designation || staff.designation,
      status: status || staff.status,
    });

    const safeStaff = staff.toJSON();
    delete safeStaff.password;

    res.json({
      message: "Staff updated successfully",
      staff: safeStaff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update staff",
      error: error.message,
    });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    await staff.destroy();

    res.json({
      message: "Staff deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete staff",
      error: error.message,
    });
  }
};