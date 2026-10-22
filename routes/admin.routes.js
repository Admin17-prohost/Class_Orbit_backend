const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const adminCtrl = require("../controllers/admin.controller");

router.put(
  "/change-password",
  verifyToken,
  allowRoles("ADMIN"),
  adminCtrl.changeAdminPassword
);

module.exports = router;