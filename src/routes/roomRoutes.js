const express = require("express");

const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "hod"), createRoom);

router.get("/", protect, allowRoles("admin", "hod", "staff"), getAllRooms);

router.get("/:id", protect, allowRoles("admin", "hod", "staff"), getRoomById);

router.put("/:id", protect, allowRoles("admin", "hod"), updateRoom);

router.delete("/:id", protect, allowRoles("admin", "hod"), deleteRoom);

module.exports = router;