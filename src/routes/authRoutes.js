const express = require("express");
const authctrl = require("../controllers/authController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authctrl.register);
router.post("/login", authctrl.login);

router.put( "/change-password",
  protect,
  authctrl.changePassword
);

module.exports = router;