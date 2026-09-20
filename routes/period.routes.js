const express = require("express");
const router = express.Router();

const periodCtrl = require("../controllers/period.controller");

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Create period
router.post(
    "/",
    verifyToken,
    allowRoles("ADMIN"),
    periodCtrl.createPeriod
);

// Get all periods
router.get(
    "/",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    periodCtrl.getAllPeriods
);

// Update period
router.put(
    "/:id",
    verifyToken,
    allowRoles("ADMIN"),
    periodCtrl.updatePeriod
);

// Delete period
router.delete(
    "/:id",
    verifyToken,
    allowRoles("ADMIN"),
    periodCtrl.deletePeriod
);

module.exports = router;