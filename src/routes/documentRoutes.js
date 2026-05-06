const express = require("express");

const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");
const upload = require("../utils/documentUpload");

const router = express.Router();

router.post(
  "/upload",
  protect,
  allowRoles("admin", "hod"),
  upload.single("document"),
  uploadDocument
);

router.get(
  "/",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getAllDocuments
);

router.get(
  "/:id",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  getDocumentById
);

router.get(
  "/download/:id",
  protect,
  allowRoles("admin", "hod", "staff", "official", "student"),
  downloadDocument
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin", "hod"),
  deleteDocument
);

module.exports = router;