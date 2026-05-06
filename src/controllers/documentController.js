const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");

exports.uploadDocument = async (req, res) => {
  try {
    const { title, category, visibility = "all" } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const document = await Document.create({
      title,
      category,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
      uploadedRole: req.user.role,
      visibility,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: {
        status: "active",
      },
      order: [["createdAt", "DESC"]],
    });

    const filteredDocuments = documents.filter((doc) => {
      return doc.visibility === "all" || doc.visibility === req.user.role;
    });

    res.json({
      message: "Documents fetched successfully",
      count: filteredDocuments.length,
      documents: filteredDocuments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document || document.status !== "active") {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (
      document.visibility !== "all" &&
      document.visibility !== req.user.role
    ) {
      return res.status(403).json({
        message: "You do not have access to this document",
      });
    }

    res.json({
      message: "Document fetched successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document || document.status !== "active") {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (
      document.visibility !== "all" &&
      document.visibility !== req.user.role
    ) {
      return res.status(403).json({
        message: "You do not have access to this document",
      });
    }

    const filePath = path.resolve(document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found on server",
      });
    }

    res.download(filePath, document.fileName);
  } catch (error) {
    res.status(500).json({
      message: "Failed to download document",
      error: error.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const filePath = path.resolve(document.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.destroy();

    res.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};