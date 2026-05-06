const express = require("express");
const staffctrl = require("../controllers/staffController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "hod"), staffctrl.createStaff);

router.get("/", protect, allowRoles("admin", "hod", "staff"), staffctrl.getAllStaff);

router.get("/:id", protect, allowRoles("admin", "hod", "staff"), staffctrl.getStaffById);

router.put("/:id", protect, allowRoles("admin", "hod"), staffctrl.updateStaff);

router.delete("/:id", protect, allowRoles("admin", "hod"), staffctrl.deleteStaff);

module.exports = router;