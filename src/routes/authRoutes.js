const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

router.get(
  "/admin-only",
  protect,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin only route accessed" });
  }
);

module.exports = router;