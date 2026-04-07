const documentService = require("../services/documentService");
const idParam = require("../middlewares/idParam");

/**
 * GET /documento - Get all documents with optional search and pagination
 */
async function getDocuments(req, res) {
    try {
        const { page = 1 } = req.query;
        const searchQuery = req.query.search;

        const result = await documentService.getAllDocuments(searchQuery, page);

        if (!result.success) {
            const statusCode = searchQuery ? 400 : 500;
            return res.status(statusCode).json({ erro: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * GET /documento/tipo/:tipo - Get documents by type with pagination
 */
async function getDocumentsByType(req, res) {
    try {
        const { page = 1 } = req.query;
        const tipo = req.params.tipo;

        const result = await documentService.getDocumentsByType(tipo, page);

        if (!result.success) {
            return res.status(400).json({ erro: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * GET /documento/id/:id - Get single document by ID with keywords and related info
 */
async function getDocumentById(req, res) {
    try {
        const id = idParam(req);

        const result = await documentService.getDocumentById(id);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * GET /documento/download/:id/:nome - Download specific document
 */
async function downloadDocument(req, res) {
    try {
        const id = idParam(req);
        const fileName = req.params.nome;

        const result = await documentService.getDocumentForDownload(id, fileName);

        if (!result.success) {
            return res.status(400).json({ erro: result.error });
        }

        const directoryPath = __basedir + "../../storage/" + result.data.storagePath;
        res.download(directoryPath + fileName, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "There was an issue in downloading the file. " + err
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getDocuments,
    getDocumentsByType,
    getDocumentById,
    downloadDocument
};
