const express = require("express");
const {
  createHOD,
  getAllHODs,
  getHODById,
  updateHOD,
  deleteHOD,
  assignDepartment,
} = require("../controllers/hodController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createHOD);

router.get("/", protect, allowRoles("admin", "hod"), getAllHODs);

router.get("/:id", protect, allowRoles("admin", "hod"), getHODById);

router.put("/:id", protect, allowRoles("admin"), updateHOD);

router.delete("/:id", protect, allowRoles("admin"), deleteHOD);

router.patch(
  "/:id/department",
  protect,
  allowRoles("admin"),
  assignDepartment
);

module.exports = router;