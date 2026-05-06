const express = require("express");

const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "hod"), createSubject);

router.get("/", protect, allowRoles("admin", "hod", "staff"), getAllSubjects);

router.get("/:id", protect, allowRoles("admin", "hod", "staff"), getSubjectById);

router.put("/:id", protect, allowRoles("admin", "hod"), updateSubject);

router.delete("/:id", protect, allowRoles("admin", "hod"), deleteSubject);

module.exports = router;