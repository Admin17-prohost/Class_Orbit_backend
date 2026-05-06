const ClassRoom = require("../models/ClassRoom");

exports.createClass = async (req, res) => {
  try {
    const {
      className,
      department,
      year,
      semester,
      section,
      classRoom,
      classIncharge,
      status,
    } = req.body;

    const existingClass = await ClassRoom.findOne({
      where: {
        className,
        department,
        year,
        semester,
        section,
      },
    });

    if (existingClass) {
      return res.status(400).json({
        message: "Class already exists",
      });
    }

    const newClass = await ClassRoom.create({
      className,
      department,
      year,
      semester,
      section,
      classRoom,
      classIncharge,
      status,
    });

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create class",
      error: error.message,
    });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassRoom.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Classes fetched successfully",
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findByPk(req.params.id);

    if (!classRoom) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json({
      message: "Class fetched successfully",
      class: classRoom,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch class",
      error: error.message,
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const {
      className,
      department,
      year,
      semester,
      section,
      classRoom,
      classIncharge,
      status,
    } = req.body;

    const classData = await ClassRoom.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    await classData.update({
      className: className || classData.className,
      department: department || classData.department,
      year: year || classData.year,
      semester: semester || classData.semester,
      section: section || classData.section,
      classRoom: classRoom || classData.classRoom,
      classIncharge: classIncharge || classData.classIncharge,
      status: status || classData.status,
    });

    res.json({
      message: "Class updated successfully",
      class: classData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update class",
      error: error.message,
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classData = await ClassRoom.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    await classData.destroy();

    res.json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete class",
      error: error.message,
    });
  }
};