const userService = require("../services/userService");
const idParam = require("../middlewares/idParam");

/**
 * GET /minha-conta - Get user profile
 */
async function getProfile(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;

        const result = await userService.getUserProfile(email);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * POST /minha-conta - Create or update user profile (student/teacher)
 */
async function upsertProfile(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;

        const result = await userService.upsertUserProfile(email, req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * GET /minha-conta/meus-documentos - Get user's documents
 */
async function getUserDocuments(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;

        const result = await userService.getUserDocuments(email);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * GET /minha-conta/novo-documento - Get form data for new document creation
 */
async function getNewDocumentForm(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;

        const result = await userService.getNewDocumentForm(email);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * POST /minha-conta/novo-documento - Create new document
 */
async function createDocument(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;

        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
        }

        const result = await userService.createDocument(email, req.body, req.file.originalname);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * GET /minha-conta/meus-documentos/alterar-documento/:id - Get document data for editing
 */
async function getDocumentForEdit(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;
        const docId = idParam(req);

        const result = await userService.getDocumentForEdit(email, docId);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * PUT /minha-conta/meus-documentos/alterar-documento/:id - Update document (without file)
 */
async function updateDocument(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;
        const docId = idParam(req);

        const result = await userService.updateDocument(email, docId, req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * PUT /minha-conta/meus-documentos/alterar-documento/:id/upload - Update document file
 */
async function updateDocumentFile(req, res) {
    try {
        const token = req.cookies.token;
        const decoded = require('jsonwebtoken').decode(token);
        const email = decoded.email;
        const docId = idParam(req);

        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
        }

        const result = await userService.updateDocumentFile(email, docId, req.file.originalname);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

/**
 * DELETE /minha-conta/meus-documentos/:id - Delete document
 */
async function deleteDocument(req, res) {
    try {
        const docId = idParam(req);

        const result = await userService.deleteDocument(docId);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(401).json({ err: { message: error.message, stack: error.stack } });
    }
}

module.exports = {
    getProfile,
    upsertProfile,
    getUserDocuments,
    getNewDocumentForm,
    createDocument,
    getDocumentForEdit,
    updateDocument,
    updateDocumentFile,
    deleteDocument
};
