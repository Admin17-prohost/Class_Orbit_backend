const express = require("express");
const router = express.Router();

const timetableCtrl = require("../controllers/timetable.controller");
const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Generate empty timetable slots
router.post(
    "/generate-slots",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.generateTimetableSlots
);

// Assign subjects and staff
router.post(
    "/assign",
    verifyToken,
    allowRoles("ADMIN", "HOD"),
    timetableCtrl.assignSubjectsToTimetable
);

module.exports = router;