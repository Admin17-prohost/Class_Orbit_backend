const express = require("express");
const router = express.Router();

const timetableCtrl = require("../controllers/timetable.controller");

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Generate 30 timetable slots
router.post(
    "/generate-slots",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.generateTimetableSlots
);

// Automatically assign subjects and staff
router.post(
    "/assign",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.assignSubjectsToTimetable
);

// Weekly timetable - MUST come before /class/:classID
router.get(
    "/class/:classID/weekly",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    timetableCtrl.getWeeklyTimetable
);

// Get timetable by class
router.get(
    "/class/:classID",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    timetableCtrl.getTimetableByClass
);

// Get timetable by department
router.get(
    "/department/:departmentID",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    timetableCtrl.getTimetableByDepartment
);

// Update a timetable slot
router.put(
    "/slot/:id",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.updateTimetableSlot
);

// Reset timetable - keeps 30 slots, clears subject/staff
router.put(
    "/class/:classID/reset",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.resetTimetableByClass
);

// Delete one timetable slot
router.delete(
    "/slot/:id",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.deleteTimetableSlot
);

// Delete complete timetable
router.delete(
    "/class/:classID",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.clearTimetableByClass
);

// Get today's timetable for a class
router.get(
    "/today/class/:classID",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    timetableCtrl.getTodayTimetable
);

module.exports = router;