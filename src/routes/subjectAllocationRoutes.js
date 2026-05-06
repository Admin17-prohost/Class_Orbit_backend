const express = require("express");

const {
  createAllocation,
  getAllAllocations,
  getAllocationById,
  updateAllocation,
  deleteAllocation,
} = require("../controllers/subjectAllocationController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "hod"), createAllocation);

router.get(
  "/",
  protect,
  allowRoles("admin", "hod", "staff"),
  getAllAllocations
);

router.get(
  "/:id",
  protect,
  allowRoles("admin", "hod", "staff"),
  getAllocationById
);

router.put("/:id", protect, allowRoles("admin", "hod"), updateAllocation);

router.delete("/:id", protect, allowRoles("admin", "hod"), deleteAllocation);

module.exports = router;