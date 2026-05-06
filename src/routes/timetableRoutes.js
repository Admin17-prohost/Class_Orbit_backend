const express = require("express");

const {
  generateTimetable,
  getAllTimetables,
  getTimetableByClass,
  updateTimetableSlot,
  moveTimetableSlot,
  deleteTimetableSlot,
  clearClassTimetable,
  checkStaffAvailability,
  getStaffFullDaySchedule,
  checkClassHour,
  getClassFullDaySchedule,
} = require("../controllers/timetableController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate/:classId",
  protect,
  allowRoles("admin", "hod"),
  generateTimetable
);

router.get(
  "/",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getAllTimetables
);

router.get(
  "/class/:classId",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getTimetableByClass
);

router.put(
  "/:id",
  protect,
  allowRoles("admin", "hod"),
  updateTimetableSlot
);

router.patch(
  "/:id/move",
  protect,
  allowRoles("admin", "hod"),
  moveTimetableSlot
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin", "hod"),
  deleteTimetableSlot
);

router.delete(
  "/class/:classId",
  protect,
  allowRoles("admin", "hod"),
  clearClassTimetable
);
router.get(
  "/check/staff",
  protect,
  allowRoles("admin", "hod", "staff", "official"),
  checkStaffAvailability
);

router.get(
  "/schedule/staff",
  protect,
  allowRoles("admin", "hod", "staff", "official"),
  getStaffFullDaySchedule
);

router.get(
  "/check/class",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  checkClassHour
);

router.get(
  "/schedule/class",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getClassFullDaySchedule
);

module.exports = router;