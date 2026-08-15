const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const officialCrtl = require("../controllers/official.controller");

router.post("/create", verifytoken, allowRoles("ADMIN"), officialCrtl.officialCreate);
router.get("/getAll", verifytoken, allowRoles("ADMIN"), officialCrtl.officialGetAll);
router.get("/getById/:id", verifytoken, allowRoles("ADMIN"), officialCrtl.officialGetById);
router.put("/update/:id", verifytoken, allowRoles("ADMIN"), officialCrtl.officialUpdate);
router.delete("/delete/:id", verifytoken, allowRoles("ADMIN"), officialCrtl.officialDelete);

module.exports = router;