const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode, hodName, status } = req.body;

    const existingDepartment = await Department.findOne({
      where: {
        departmentName,
      },
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    const existingCode = await Department.findOne({
      where: {
        departmentCode,
      },
    });

    if (existingCode) {
      return res.status(400).json({
        message: "Department code already exists",
      });
    }

    const department = await Department.create({
      departmentName,
      departmentCode,
      hodName,
      status,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Departments fetched successfully",
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json({
      message: "Department fetched successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode, hodName, status } = req.body;

    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    if (
      departmentName &&
      departmentName !== department.departmentName
    ) {
      const existingDepartment = await Department.findOne({
        where: { departmentName },
      });

      if (existingDepartment) {
        return res.status(400).json({
          message: "Department name already exists",
        });
      }
    }

    if (
      departmentCode &&
      departmentCode !== department.departmentCode
    ) {
      const existingCode = await Department.findOne({
        where: { departmentCode },
      });

      if (existingCode) {
        return res.status(400).json({
          message: "Department code already exists",
        });
      }
    }

    await department.update({
      departmentName: departmentName || department.departmentName,
      departmentCode: departmentCode || department.departmentCode,
      hodName: hodName || department.hodName,
      status: status || department.status,
    });

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    await department.destroy();

    res.json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete department",
      error: error.message,
    });
  }
};