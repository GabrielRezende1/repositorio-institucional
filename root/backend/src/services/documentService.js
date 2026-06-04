const db = require("../config/index");

const DOCUMENT_TYPE_MAPPING = {
    "artigo+de+evento": 1,
    "artigo+de+periodico": 2,
    "capitulo+de+livro": 3,
    "dissertacao": 4,
    "livro": 5,
    "monografia": 6,
    "tese": 7,
    "tcc": 8,
    "politica": 9,
    "tutorial": 10
};

const DOCUMENT_STORAGE_MAPPING = {
    1: "event_articles/",
    2: "journal_articles/",
    3: "book_chapter/",
    4: "dissertations/",
    5: "books/",
    6: "monographs/",
    7: "theses/",
    8: "final_course_projects/",
    9: "policies/",
    10: "tutorials/"
}

const EXCLUDED_TYPES = [9, 10]; // Policy, Tutorial
const PAGE_LIMIT = 3;

/**
 * Build pagination object
 * @param {number} page - Current page
 * @param {number} docCount - Total document count
 * @param {number} limit - Documents per page
 * @returns {Object} Pagination information
 */
const buildPagination = (page, docCount, limit) => {
    const lastPage = Math.ceil(docCount / limit);
    return {
        path: "/documento",
        page: page,
        prev_page_url: Number(page) - 1 >= 1 ? Number(page) - 1 : false,
        next_page_url: Number(page) + 1 > lastPage ? false : Number(page) + 1,
        lastPage: lastPage,
        total_documents: docCount
    };
};

/**
 * Get all documents with optional search and pagination
 * @param {string} searchQuery - Optional search term
 * @param {number} page - Page number
 * @returns {Object} Documents and pagination data
 */
async function getAllDocuments(searchQuery, page = 1) {
    try {
        let docs;

        if (!searchQuery) {
            docs = await db.Documento.findAndCountAll({
                attributes: [
                    "id_documento",
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    "data"
                ],
                order: [["data", "ASC"]],
                where: {
                    fk_id_doc_tipo: {
                        [db.Sequelize.Op.and]: [
                            { [db.Sequelize.Op.ne]: EXCLUDED_TYPES[0] },
                            { [db.Sequelize.Op.ne]: EXCLUDED_TYPES[1] }
                        ]
                    }
                },
                include: ["Discente", "Docente", "Doc_tipo"],
                offset: Number(page * PAGE_LIMIT - PAGE_LIMIT),
                limit: PAGE_LIMIT
            });
        } else {
            docs = await db.Documento.findAndCountAll({
                attributes: [
                    "id_documento",
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    "data"
                ],
                where: {
                    nome_doc: {
                        [db.Sequelize.Op.like]: `%${searchQuery}%`
                    },
                    fk_id_doc_tipo: {
                        [db.Sequelize.Op.and]: [
                            { [db.Sequelize.Op.ne]: EXCLUDED_TYPES[0] },
                            { [db.Sequelize.Op.ne]: EXCLUDED_TYPES[1] }
                        ]
                    }
                },
                order: [
                    ["nome_doc", "ASC"],
                    ["data", "ASC"]
                ],
                include: ["Discente", "Docente", "Doc_tipo"],
                offset: Number(page * PAGE_LIMIT - PAGE_LIMIT),
                limit: PAGE_LIMIT
            });

            if (docs.count === 0) {
                return {
                    success: false,
                    error: `Não encontramos nenhum documento com '${searchQuery}'`
                };
            }
        }

        if (!docs) {
            return { success: false, error: "Não foi possível recuperar os dados!" };
        }

        const pagination = buildPagination(page, docs.count, PAGE_LIMIT);

        return {
            success: true,
            data: {
                docRows: docs.rows,
                pagination
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get documents by type with pagination
 * @param {string} tipo - Document type string
 * @param {number} page - Page number
 * @returns {Object} Documents and pagination data
 */
async function getDocumentsByType(tipo, page = 1) {
    try {
        const docTypeId = DOCUMENT_TYPE_MAPPING[tipo];

        if (!docTypeId) {
            return { success: false, error: "Tipo de documento inválido" };
        }

        const docTipo = await db.Doc_tipo.findOne({
            where: { id_doc_tipo: docTypeId }
        });

        if (!docTipo) {
            return { success: false, error: "Tipo de documento não encontrado" };
        }

        const docs = await db.Documento.findAndCountAll({
            attributes: {
                include: [
                    "id_documento",
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    "data",
                    "fk_id_docente",
                    "fk_id_doc_tipo"
                ]
            },
            include: ["Discente", "Docente", "Doc_tipo"],
            where: { fk_id_doc_tipo: docTypeId },
            offset: Number(page * PAGE_LIMIT - PAGE_LIMIT),
            limit: PAGE_LIMIT
        });

        if (docs.count === 0) {
            return {
                success: false,
                error: `Nenhum documento encontrado para o tipo: ${tipo}`
            };
        }

        const pagination = buildPagination(page, docs.count, PAGE_LIMIT);

        return {
            success: true,
            data: {
                docRows: docs.rows,
                pagination
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get single document by ID with keywords and related user info
 * @param {number} id - Document ID
 * @returns {Object} Document details
 */
async function getDocumentById(id) {
    try {
        const doc = await db.Documento.findAll({
            where: { id_documento: id },
            attributes: {
                include: [
                    "id_documento",
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    "data",
                    "fk_id_docente",
                    "fk_id_discente",
                    "fk_id_doc_tipo"
                ]
            },
            include: ["Discente", "Docente", "Doc_tipo"]
        });

        // Check if document exists
        if (doc.length === 0) {
            return {
                success: false,
                error: "Documento não existe! Você tentou acessar um documento manualmente."
            };
        }

        // Prevent accessing documents out of scope (Policy, Tutorial)
        if (doc[0].dataValues.fk_id_doc_tipo === EXCLUDED_TYPES[0] || doc[0].dataValues.fk_id_doc_tipo === EXCLUDED_TYPES[1]) {
            return {
                success: false,
                error: "Você tentou acessar um documento fora do escopo da rota!"
            };
        }

        // Get teacher information
        const teacher = await db.Docente.findOne({
            where: { id_docente: doc[0].dataValues.fk_id_docente }
        });

        // Get document keywords
        const docKeyword = await db.Doc_pal_chave.findAll({
            where: { fk_id_documento: doc[0].dataValues.id_documento },
            include: ["Palavra_chave"]
        });

        // Check if document is from a student or teacher
        const student = await db.Discente.findOne({
            where: { id_discente: doc[0].dataValues.fk_id_discente }
        });

        const isStudent = student !== null;

        return {
            success: true,
            data: {
                isStudent,
                doc,
                docKeyword,
                teacher,
                student: isStudent ? student : undefined
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get document file information for download
 * @param {number} id - Document ID
 * @param {string} fileName - Document file name
 * @returns {Object} Document file data
 */
async function getDocumentForDownload(id, fileName) {
    try {
        const document = await db.Documento.findOne({
            attributes: ["id_documento", "nome_doc", "nome_arq", "resumo", "data", "fk_id_doc_tipo"],
            where: {
                id_documento: id,
                nome_arq: fileName
            }
        });

        if (!document) {
            return { success: false, error: "Não foi possível recuperar os dados!" };
        }

        // Get the storage path based on document type ID
        const docTypeId = document.fk_id_doc_tipo;
        const storagePath = DOCUMENT_STORAGE_MAPPING[docTypeId];

        if (!storagePath) {
            return { success: false, error: "Tipo de documento não encontrado" };
        }

        return {
            success: true,
            data: {
                document,
                storagePath
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getAllDocuments,
    getDocumentsByType,
    getDocumentById,
    getDocumentForDownload
};
