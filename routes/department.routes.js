const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const deptCrtl = require("../controllers/department.controller");

router.post("/create", verifytoken, isAdmin, deptCrtl.createDept);
router.get("/", verifytoken, isAdmin, deptCrtl.getAllDept);
router.get("/:id", verifytoken, isAdmin, deptCrtl.getDept)
router.put("/:id", verifytoken,isAdmin, deptCrtl.updateDept);
router.delete("/:id", verifytoken, isAdmin, deptCrtl.deleteDept);

module.exports = router;