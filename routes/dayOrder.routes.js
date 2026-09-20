const express = require("express");
const router = express.Router();

const dayOrderCtrl = require("../controllers/dayOrder.controller");

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// Create
router.post(
    "/",
    verifyToken,
    allowRoles("ADMIN"),
    dayOrderCtrl.createDayOrder
);

// Get all
router.get(
    "/",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    dayOrderCtrl.getAllDayOrders
);

// Get today
router.get(
    "/today",
    verifyToken,
    allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
    dayOrderCtrl.getTodayDayOrder
);

// Update
router.put(
    "/:id",
    verifyToken,
    allowRoles("ADMIN"),
    dayOrderCtrl.updateDayOrder
);

// Delete
router.delete(
    "/:id",
    verifyToken,
    allowRoles("ADMIN"),
    dayOrderCtrl.deleteDayOrder
);

module.exports = router;