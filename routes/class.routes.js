const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const classCrtl = require("../controllers/class.controller");

router.post("/create", verifytoken, allowRoles("ADMIN"), classCrtl.classCreate);
router.get("/", verifytoken, allowRoles("ADMIN", "HOD"), classCrtl.classGetAll);
router.get("/:id", verifytoken, allowRoles("ADMIN", "HOD"), classCrtl.classGetById);
router.put("/:id", verifytoken, allowRoles("ADMIN"), classCrtl.classUpdate);
router.delete("/:id", verifytoken, allowRoles("ADMIN"), classCrtl.classDelete);

module.exports = router;