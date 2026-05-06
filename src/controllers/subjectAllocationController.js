const SubjectAllocation = require("../models/SubjectAllocation");

exports.createAllocation = async (req, res) => {
  try {
    const {
      classId,
      subjectId,
      staffId,
      roomId,
      subjectType,
      weeklyHours,
      status,
    } = req.body;

    const existingAllocation = await SubjectAllocation.findOne({
      where: {
        classId,
        subjectId,
      },
    });

    if (existingAllocation) {
      return res.status(400).json({
        message: "This subject is already allocated for this class",
      });
    }

    const allocation = await SubjectAllocation.create({
      classId,
      subjectId,
      staffId,
      roomId,
      subjectType,
      weeklyHours,
      status,
    });

    res.status(201).json({
      message: "Subject allocation created successfully",
      allocation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create subject allocation",
      error: error.message,
    });
  }
};

exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await SubjectAllocation.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Subject allocations fetched successfully",
      count: allocations.length,
      allocations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subject allocations",
      error: error.message,
    });
  }
};

exports.getAllocationById = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.findByPk(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        message: "Subject allocation not found",
      });
    }

    res.json({
      message: "Subject allocation fetched successfully",
      allocation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subject allocation",
      error: error.message,
    });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const {
      classId,
      subjectId,
      staffId,
      roomId,
      subjectType,
      weeklyHours,
      status,
    } = req.body;

    const allocation = await SubjectAllocation.findByPk(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        message: "Subject allocation not found",
      });
    }

    await allocation.update({
      classId: classId || allocation.classId,
      subjectId: subjectId || allocation.subjectId,
      staffId: staffId || allocation.staffId,
      roomId: roomId || allocation.roomId,
      subjectType: subjectType || allocation.subjectType,
      weeklyHours: weeklyHours || allocation.weeklyHours,
      status: status || allocation.status,
    });

    res.json({
      message: "Subject allocation updated successfully",
      allocation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update subject allocation",
      error: error.message,
    });
  }
};

exports.deleteAllocation = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.findByPk(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        message: "Subject allocation not found",
      });
    }

    await allocation.destroy();

    res.json({
      message: "Subject allocation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subject allocation",
      error: error.message,
    });
  }
};