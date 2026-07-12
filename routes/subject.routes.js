const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const subjectCtrl = require("../controllers/subject.controller");

router.post("/create", verifyToken, subjectCtrl.subjectCreate);
router.get("/", verifyToken, subjectCtrl.getAllSubjects);
router.get("/:id", verifyToken, subjectCtrl.getSubject);
router.delete("/:id", verifyToken, subjectCtrl.delSubject);
router.put("/:id", verifyToken, subjectCtrl.updatesubject);

//router.get("/test", verifyToken, (req, res) => { res.json({ success: true,}); });

module.exports = router;