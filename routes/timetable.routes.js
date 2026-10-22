const express = require("express");

const router = express.Router();

const timetableCtrl = require("../controllers/timetable.controller");

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Generate timetable slots
router.post(
  "/generate-slots",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.generateTimetableSlots
);

// Automatically assign subjects and staff
router.post(
  "/assign",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.assignSubjectsToTimetable
);

// Weekly timetable - MUST come before /class/:classID
router.get(
  "/class/:classID/weekly",
  verifyToken,
  allowRoles("HOD", "STAFF", "STUDENT", "OFFICIAL"),
  timetableCtrl.getWeeklyTimetable
);

// Get timetable by class
router.get(
  "/class/:classID",
  verifyToken,
  allowRoles("HOD", "STAFF", "STUDENT", "OFFICIAL"),
  timetableCtrl.getTimetableByClass
);

// Get timetable by department
router.get(
  "/department/:departmentID",
  verifyToken,
  allowRoles("HOD", "STAFF", "STUDENT", "OFFICIAL"),
  timetableCtrl.getTimetableByDepartment
);

// Update a timetable slot
 
router.put(
  "/slot/:id",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.updateTimetableSlot
);

// Reset timetable - keeps slots, clears subject/staff
 
router.put(
  "/class/:classID/reset",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.resetTimetableByClass
);

// Delete one timetable slot
 
router.delete(
  "/slot/:id",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.deleteTimetableSlot
);

// Delete complete timetable
 
router.delete(
  "/class/:classID",
  verifyToken,
  allowRoles("HOD"),
  timetableCtrl.clearTimetableByClass
);

// Get today's timetable

router.get(
  "/today/class/:classID",
  verifyToken,
  allowRoles("HOD", "STAFF", "STUDENT", "OFFICIAL"),
  timetableCtrl.getTodayTimetable
);

module.exports = router;