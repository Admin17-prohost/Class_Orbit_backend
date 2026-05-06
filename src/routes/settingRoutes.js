const express = require("express");

const {
  createSetting,
  getSettings,
  updateSetting,
} = require("../controllers/settingController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createSetting);

router.get("/", protect, allowRoles("admin", "hod", "staff"), getSettings);

router.put("/:id", protect, allowRoles("admin"), updateSetting);

module.exports = router;