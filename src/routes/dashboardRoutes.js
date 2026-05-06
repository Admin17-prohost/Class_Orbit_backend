const express = require("express");

const {
  getAdminDashboard,
  getHODDashboard,
  getStaffDashboard,
} = require("../controllers/dashboardController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin", protect, allowRoles("admin"), getAdminDashboard);

router.get("/hod", protect, allowRoles("hod"), getHODDashboard);

router.get("/staff", protect, allowRoles("staff"), getStaffDashboard);

module.exports = router;