const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const deptCrtl = require("../controllers/department.controller");

router.post("/create", verifytoken, allowRoles("ADMIN"), deptCrtl.createDept);
router.get("/", verifytoken, allowRoles("ADMIN"), deptCrtl.getAllDept);
router.get("/:id", verifytoken, allowRoles("ADMIN"), deptCrtl.getDept)
router.put("/:id", verifytoken,allowRoles("ADMIN"), deptCrtl.updateDept);
router.delete("/:id", verifytoken, allowRoles("ADMIN"), deptCrtl.deleteDept);

module.exports = router;