const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createDepartment);

router.get("/", protect, allowRoles("admin", "hod", "staff"), getAllDepartments);

router.get("/:id", protect, allowRoles("admin", "hod", "staff"), getDepartmentById);

router.put("/:id", protect, allowRoles("admin"), updateDepartment);

router.delete("/:id", protect, allowRoles("admin"), deleteDepartment);

module.exports = router;