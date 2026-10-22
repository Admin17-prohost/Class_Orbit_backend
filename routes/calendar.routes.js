const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const calendarCtrl = require("../controllers/calendar.controller");

// ADMIN ONLY

router.post(
  "/",
  verifyToken,
  allowRoles("ADMIN"),
  calendarCtrl.createCalendar
);

router.get(
  "/",
  verifyToken,
  allowRoles("ADMIN", "HOD"),
  calendarCtrl.getAllCalendar
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "HOD"),
  calendarCtrl.getCalendarById
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("ADMIN"),
  calendarCtrl.updateCalendar
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("ADMIN"),
  calendarCtrl.deleteCalendar
);

module.exports = router;