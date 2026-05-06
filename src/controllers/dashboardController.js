const User = require("../models/User");
const HOD = require("../models/HOD");
const Staff = require("../models/Staff");
const Department = require("../models/Department");
const ClassRoom = require("../models/ClassRoom");
const Subject = require("../models/Subject");
const Room = require("../models/Room");
const Timetable = require("../models/Timetable");
const Document = require("../models/Document");

exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalHODs,
      totalStaff,
      totalUsers,
      totalDepartments,
      totalClasses,
      totalSubjects,
      totalRooms,
      totalDocuments,
      totalTimetableSlots,
    ] = await Promise.all([
      HOD.count(),
      Staff.count(),
      User.count(),
      Department.count(),
      ClassRoom.count(),
      Subject.count(),
      Room.count(),
      Document.count(),
      Timetable.count(),
    ]);

    res.json({
      message: "Admin dashboard fetched successfully",
      data: {
        totalHODs,
        totalStaff,
        totalUsers,
        totalDepartments,
        totalClasses,
        totalSubjects,
        totalRooms,
        totalDocuments,
        totalTimetableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};

exports.getHODDashboard = async (req, res) => {
  try {
    const department = req.user.department;

    const [departmentStaff, departmentClasses, departmentSubjects] =
      await Promise.all([
        Staff.count({ where: { department } }),
        ClassRoom.count({ where: { department } }),
        Subject.count({ where: { department } }),
      ]);

    res.json({
      message: "HOD dashboard fetched successfully",
      data: {
        department,
        departmentStaff,
        departmentClasses,
        departmentSubjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch HOD dashboard",
      error: error.message,
    });
  }
};

exports.getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;

    const myTimetableSlots = await Timetable.count({
      where: { staffId },
    });

    res.json({
      message: "Staff dashboard fetched successfully",
      data: {
        staffId,
        myTimetableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff dashboard",
      error: error.message,
    });
  }
};