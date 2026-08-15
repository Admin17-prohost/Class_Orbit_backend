const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const hodCrtl = require("../controllers/hod.controller");

router.post("/create", verifytoken, allowRoles("ADMIN"), hodCrtl.hodCreate);
router.get("/", verifytoken, allowRoles("ADMIN"), hodCrtl.hodGetAll);
router.get("/:id", verifytoken, allowRoles("ADMIN"), hodCrtl.getHodbyId);
router.put("/:id", verifytoken, allowRoles("ADMIN"), hodCrtl.hodUpdate);
router.delete("/:id", verifytoken, allowRoles("ADMIN"), hodCrtl.hodDelete);

module.exports = router;