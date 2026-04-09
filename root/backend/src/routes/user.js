const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authToken = require("../middlewares/auth");
const { upload } = require("../middlewares/file.controller");

/**
 * /minha-conta - Get/create user profile
 * /minha-conta/meus-documentos - Get user's documents
 * /minha-conta/novo-documento - Create new document
 * /minha-conta/meus-documentos/alterar-documento/:id - Get/update document
 * /minha-conta/meus-documentos/alterar-documento/:id/upload - Update document file
 */

// GET /minha-conta - Get user profile
router.get("/minha-conta", authToken, userController.getProfile);

// POST /minha-conta - Create or update user profile (student/teacher)
router.post("/minha-conta", authToken, userController.upsertProfile);

// GET /minha-conta/meus-documentos - Get user's documents
router.get("/minha-conta/meus-documentos", authToken, userController.getUserDocuments);

// GET /minha-conta/novo-documento - Get form data for new document
router.get("/minha-conta/novo-documento", authToken, userController.getNewDocumentForm);

// POST /minha-conta/novo-documento - Create new document (with file upload)
router.post("/minha-conta/novo-documento", authToken, upload, userController.createDocument);

// GET /minha-conta/meus-documentos/alterar-documento/:id - Get document for editing
router.get("/minha-conta/meus-documentos/alterar-documento/:id", authToken, userController.getDocumentForEdit);

// PUT /minha-conta/meus-documentos/alterar-documento/:id - Update document metadata
router.put("/minha-conta/meus-documentos/alterar-documento/:id", authToken, userController.updateDocument);

// PUT /minha-conta/meus-documentos/alterar-documento/:id/upload - Update document file
router.put("/minha-conta/meus-documentos/alterar-documento/:id/upload", authToken, upload, userController.updateDocumentFile);

// DELETE /minha-conta/meus-documentos/:id - Delete document
router.delete("/minha-conta/meus-documentos/:id", authToken, userController.deleteDocument);

module.exports = router;
