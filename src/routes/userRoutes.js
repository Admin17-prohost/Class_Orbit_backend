const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createUser);

router.get("/", protect, allowRoles("admin", "hod"), getAllUsers);

router.get("/:id", protect, allowRoles("admin", "hod"), getUserById);

router.put("/:id", protect, allowRoles("admin"), updateUser);

router.delete("/:id", protect, allowRoles("admin"), deleteUser);

module.exports = router;