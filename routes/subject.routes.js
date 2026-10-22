const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const subjectCtrl = require("../controllers/subject.controller");

router.post(
  "/create",
  verifyToken,
  allowRoles("ADMIN"),
  subjectCtrl.subjectCreate
);

router.get(
  "/",
  verifyToken,
  allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
  subjectCtrl.getAllSubjects
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "HOD", "STAFF", "STUDENT", "OFFICIAL"),
  subjectCtrl.getSubject
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("ADMIN"),
  subjectCtrl.delSubject
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("ADMIN"),
  subjectCtrl.updatesubject
);

module.exports = router;