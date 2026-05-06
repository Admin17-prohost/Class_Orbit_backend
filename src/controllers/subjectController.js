const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      subjectType,
      weeklyHours,
      department,
      semester,
      status,
    } = req.body;

    const existingSubject = await Subject.findOne({
      where: { subjectCode },
    });

    if (existingSubject) {
      return res.status(400).json({
        message: "Subject code already exists",
      });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      subjectType,
      weeklyHours,
      department,
      semester,
      status,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Subjects fetched successfully",
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({
      message: "Subject fetched successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      subjectType,
      weeklyHours,
      department,
      semester,
      status,
    } = req.body;

    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    if (subjectCode && subjectCode !== subject.subjectCode) {
      const existingSubject = await Subject.findOne({
        where: { subjectCode },
      });

      if (existingSubject) {
        return res.status(400).json({
          message: "Subject code already exists",
        });
      }
    }

    await subject.update({
      subjectCode: subjectCode || subject.subjectCode,
      subjectName: subjectName || subject.subjectName,
      subjectType: subjectType || subject.subjectType,
      weeklyHours: weeklyHours || subject.weeklyHours,
      department: department || subject.department,
      semester: semester || subject.semester,
      status: status || subject.status,
    });

    res.json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    await subject.destroy();

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};