const HOD = require("../models/HOD");

exports.createHOD = async (req, res) => {
  try {
    const { name, email, password, phone, department, status } = req.body;

    const existingEmail = await HOD.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "HOD email already exists" });
    }

    const existingDepartment = await HOD.findOne({ where: { department } });
    if (existingDepartment) {
      return res.status(400).json({
        message: "This department already has an HOD",
      });
    }

    const hod = await HOD.create({
      name,
      email,
      password,
      phone,
      department,
      status,
    });

    res.status(201).json({
      message: "HOD created successfully",
      hod,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create HOD",
      error: error.message,
    });
  }
};

exports.getAllHODs = async (req, res) => {
  try {
    const hods = await HOD.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "HODs fetched successfully",
      count: hods.length,
      hods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch HODs",
      error: error.message,
    });
  }
};

exports.getHODById = async (req, res) => {
  try {
    const hod = await HOD.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    res.json({
      message: "HOD fetched successfully",
      hod,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch HOD",
      error: error.message,
    });
  }
};

exports.updateHOD = async (req, res) => {
  try {
    const { name, email, password, phone, department, status } = req.body;

    const hod = await HOD.findByPk(req.params.id);

    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    if (email && email !== hod.email) {
      const existingEmail = await HOD.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already used" });
      }
    }

    if (department && department !== hod.department) {
      const existingDepartment = await HOD.findOne({ where: { department } });
      if (existingDepartment) {
        return res.status(400).json({
          message: "This department already has an HOD",
        });
      }
    }

    await hod.update({
      name: name || hod.name,
      email: email || hod.email,
      password: password || hod.password,
      phone: phone || hod.phone,
      department: department || hod.department,
      status: status || hod.status,
    });

    const safeHOD = hod.toJSON();
    delete safeHOD.password;

    res.json({
      message: "HOD updated successfully",
      hod: safeHOD,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update HOD",
      error: error.message,
    });
  }
};

exports.deleteHOD = async (req, res) => {
  try {
    const hod = await HOD.findByPk(req.params.id);

    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    await hod.destroy();

    res.json({
      message: "HOD deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete HOD",
      error: error.message,
    });
  }
};

exports.assignDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    const hod = await HOD.findByPk(req.params.id);

    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    const existingDepartment = await HOD.findOne({ where: { department } });

    if (existingDepartment && existingDepartment.id !== hod.id) {
      return res.status(400).json({
        message: "This department already assigned to another HOD",
      });
    }

    hod.department = department;
    await hod.save();

    const safeHOD = hod.toJSON();
    delete safeHOD.password;

    res.json({
      message: "Department assigned successfully",
      hod: safeHOD,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign department",
      error: error.message,
    });
  }
};