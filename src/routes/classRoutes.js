const express = require("express");

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "hod"), createClass);

router.get("/", protect, allowRoles("admin", "hod", "staff"), getAllClasses);

router.get("/:id", protect, allowRoles("admin", "hod", "staff"), getClassById);

router.put("/:id", protect, allowRoles("admin", "hod"), updateClass);

router.delete("/:id", protect, allowRoles("admin", "hod"), deleteClass);

module.exports = router;