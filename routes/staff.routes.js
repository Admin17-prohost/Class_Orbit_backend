const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const staffCrtl = require("../controllers/staff.controller");

router.post("/create", verifytoken, allowRoles("ADMIN"), staffCrtl.staffCreate);
router.get("/", verifytoken, allowRoles("ADMIN", "HOD"), staffCrtl.staffGetAll);
router.all("/:id", verifytoken, allowRoles("ADMIN", "HOD"), staffCrtl.staffGetById);
router.put("/:id", verifytoken, allowRoles("ADMIN", "HOD"), staffCrtl.staffUpdate);
router.delete("/:id", verifytoken, allowRoles("ADMIN"), staffCrtl.staffDelete);

module.exports = router;