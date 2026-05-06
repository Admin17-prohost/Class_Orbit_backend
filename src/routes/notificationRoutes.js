const express = require("express");

const {
  createNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  getTodayClassAlerts,
} = require("../controllers/notificationController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("admin", "hod"),
  createNotification
);

router.get(
  "/",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getNotifications
);

router.patch(
  "/:id/read",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  markNotificationRead
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin", "hod"),
  deleteNotification
);

router.get(
  "/class-alerts/today",
  protect,
  allowRoles("admin", "hod", "staff"),
  getTodayClassAlerts
);

module.exports = router;