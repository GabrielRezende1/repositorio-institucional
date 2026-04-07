const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

/**
 * /documento - Get all documents with optional search and pagination
 * /documento/tipo/:tipo - Get documents by type
 * /documento/id/:id - Get single document by ID
 * /documento/download/:id/:nome - Download document
 *
 * Note: Document creation is handled by user.js
 * since only logged users can create/update docs
 */

// GET /documento - Get all documents with optional search
router.get("/documento", documentController.getDocuments);

// GET /documento/tipo/:tipo - Get documents by type
router.get("/documento/tipo/:tipo", documentController.getDocumentsByType);

// GET /documento/id/:id - Get single document
router.get("/documento/id/:id", documentController.getDocumentById);

// GET /documento/download/:id/:nome - Download document
router.get("/documento/download/:id/:nome", documentController.downloadDocument);

module.exports = router;
