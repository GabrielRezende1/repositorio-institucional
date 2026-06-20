const db = require("../config/index");
const fs = require("fs");

const ADMIN_EMAIL = "Admin";
const RESTRICTED_TYPES = [9, 10]; // Política, Tutorial
const STUDENT_EMAIL_REGEX = /@(aluno).faeterj-prc.faetec.rj.gov.br/g;

// Document type to storage directory mapping
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
};

/**
 * Get storage path for document type
 * @param {number} typeId - Document type ID
 * @returns {string} Storage directory path
 */
function getStoragePath(typeId) {
    const dir = DOCUMENT_STORAGE_MAPPING[typeId] || "";
    return `${__basedir}../../storage/${dir}`;
}

/**
 * Get storage path for document type
 * @param {number} typeId - Document type ID
 * @returns {string} Storage directory path
 */
function getStoragePath(typeId) {
    const dir = DOCUMENT_STORAGE_MAPPING[typeId] || "";
    return `${__basedir}../../storage/${dir}`;
}

/**
 * Move file from temporary storage to type-specific directory
 * @param {string} fileName - File name
 * @param {number} typeId - Document type ID
 * @returns {void}
 */
function moveFileToTypeDirectory(fileName, typeId) {
    const sourceFile = `${__basedir}../../storage/${fileName}`;
    const destDir = getStoragePath(typeId);
    const destFile = `${destDir}${fileName}`;
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move file from source to destination
    if (fs.existsSync(sourceFile) && sourceFile !== destFile) {
        fs.renameSync(sourceFile, destFile);
        console.log(`Moved ${fileName} to ${DOCUMENT_STORAGE_MAPPING[typeId]}`);
    }
}

/**
 * Determine if user is student based on email
 * @param {string} email - User email
 * @returns {boolean} True if student, false if teacher
 */
function isStudent(email) {
    return email.match(STUDENT_EMAIL_REGEX) !== null;
}

/**
 * Get user profile information with student/teacher details
 * @param {string} email - User email
 * @returns {Object} User profile data
 */
async function getUserProfile(email) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: "Usuário não encontrado" };
        }

        const userId = user.id_usuario;
        const userIsStudent = isStudent(email);
        let checkedUser;

        if (userIsStudent) {
            checkedUser = await db.Discente.findOne({
                where: { fk_id_usuario: userId }
            });
        } else {
            checkedUser = await db.Docente.findOne({
                where: { fk_id_usuario: userId }
            });
        }

        return {
            success: true,
            data: { userId, email, checkedUser, isStudent: userIsStudent }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Create or update user profile (student/teacher)
 * @param {string} email - User email
 * @param {Object} userData - User data (nome, matricula, curso, graduacao, id_funcional)
 * @returns {Object} Created or updated user profile
 */
async function upsertUserProfile(email, userData) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: "Usuário não encontrado" };
        }

        const userId = user.id_usuario;
        const userIsStudent = isStudent(email);
        const { nome, matricula, curso, graduacao, id_funcional } = userData;

        if (!userIsStudent) {
            // Teacher profile
            const exists = await db.Docente.findOne({
                where: { fk_id_usuario: userId }
            });

            if (!exists) {
                const teacher = await db.Docente.create({
                    id_funcional,
                    nome,
                    graduacao,
                    fk_id_usuario: userId
                });
                return {
                    success: true,
                    data: { msg: "Professor criado!", user, teacher }
                };
            }

            await db.Docente.update(
                { id_funcional, nome, graduacao },
                { where: { fk_id_usuario: userId } }
            );
            return {
                success: true,
                data: { msg: "Professor atualizado!", user, teacher: exists }
            };
        }

        // Student profile
        const exists = await db.Discente.findOne({
            where: { fk_id_usuario: userId }
        });

        if (!exists) {
            const student = await db.Discente.create({
                matricula,
                nome,
                curso,
                fk_id_usuario: userId
            });
            return {
                success: true,
                data: { msg: "Estudante criado!", user, student }
            };
        }

        await db.Discente.update(
            { matricula, nome, curso },
            { where: { fk_id_usuario: userId } }
        );
        return {
            success: true,
            data: { msg: "Estudante atualizado!", user, student: exists }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get user's documents
 * @param {string} email - User email
 * @returns {Object} User documents or admin documents if user is admin
 */
async function getUserDocuments(email) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: "Usuário não encontrado" };
        }

        const userId = user.id_usuario;
        const userIsStudent = isStudent(email);

        // Admin access - all documents
        if (email === ADMIN_EMAIL) {
            const docs = await db.Documento.findAll({
                attributes: {
                    include: [
                        "nome_doc",
                        "nome_arq",
                        "resumo",
                        [db.Sequelize.fn("TO_CHAR", db.Sequelize.col("data"), "DD-MM-YYYY"), "data"],
                        "fk_id_docente",
                        "fk_id_doc_tipo"
                    ]
                },
                include: ["Doc_tipo"]
            });

            return {
                success: true,
                data: { msg: "Todos os documentos para o Admin", userId, docs, email, isStudent: false }
            };
        }

        let docs;
        if (!userIsStudent) {
            // Teacher documents
            const teacher = await db.Docente.findOne({
                where: { fk_id_usuario: userId }
            });

            if (!teacher) {
                return { success: false, error: "Perfil de professor não encontrado" };
            }

            docs = await db.Documento.findAll({
                where: { fk_id_docente: teacher.id_docente },
                attributes: {
                    include: [
                        "nome_doc",
                        "nome_arq",
                        "resumo",
                        [db.Sequelize.fn("TO_CHAR", db.Sequelize.col("data"), "DD-MM-YYYY"), "data"],
                        "fk_id_docente",
                        "fk_id_doc_tipo"
                    ]
                },
                include: ["Doc_tipo"]
            });

            return {
                success: true,
                data: { msg: "Documentos do Professor", userId, docs, isStudent: false }
            };
        }

        // Student documents
        const student = await db.Discente.findOne({
            where: { fk_id_usuario: userId }
        });

        if (!student) {
            return { success: false, error: "Perfil de estudante não encontrado" };
        }

        docs = await db.Documento.findAll({
            where: { fk_id_discente: student.id_discente },
            attributes: {
                include: [
                    "nome_doc",
                    "nome_arq",
                    "resumo",
                    [db.Sequelize.fn("TO_CHAR", db.Sequelize.col("data"), "DD-MM-YYYY"), "data"],
                    "fk_id_discente",
                    "fk_id_docente",
                    "fk_id_doc_tipo"
                ]
            },
            include: ["Doc_tipo", "Docente"]
        });

        return {
            success: true,
            data: { msg: "Documentos do Estudante", userId, docs, isStudent: true }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get data for creating new document
 * @param {string} email - User email
 * @returns {Object} Form data for new document creation
 */
async function getNewDocumentForm(email) {
    try {
        const userIsStudent = isStudent(email);
        let teachers = null;

        if (userIsStudent) {
            teachers = await db.Docente.findAll();
        }

        return {
            success: true,
            data: { email, teachers, isStudent: userIsStudent }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Create new document
 * @param {string} email - User email
 * @param {Object} documentData - Document data
 * @param {string} fileName - Uploaded file name
 * @returns {Object} Created document
 */
async function createDocument(email, documentData, fileName) {
    try {
        const { titulo, resumo, data, orientador, tipo, palavraChave } = documentData;

        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
            return { success: false, error: "Usuário não encontrado" };
        }

        const typeRecord = await db.Doc_tipo.findOne({ where: { tipo } });

        if (!typeRecord) {
            fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
            return { success: false, error: "Tipo de documento não encontrado" };
        }

        const typeId = typeRecord.id_doc_tipo;

        // Admin can create restricted documents (Política, Tutorial)
        if (email === ADMIN_EMAIL) {
            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: fileName,
                data,
                fk_id_doc_tipo: typeId
            });

            // Move file to type-specific directory
            moveFileToTypeDirectory(fileName, typeId);

            return {
                success: true,
                data: { msg: `Documento "${fileName}" criado com sucesso!`, document }
            };
        }

        // Non-admin users cannot create restricted documents
        if (RESTRICTED_TYPES.includes(typeId)) {
            fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
            return { success: false, error: "Você escolheu um tipo de documento restrito!" };
        }

        const userIsStudent = isStudent(email);
        const userId = user.id_usuario;

        if (userIsStudent) {
            // Student document creation
            const student = await db.Discente.findOne({
                where: { fk_id_usuario: userId }
            });

            if (!student) {
                fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
                return { success: false, error: "Perfil de estudante não encontrado" };
            }

            const teacher = await db.Docente.findOne({
                where: { nome: { [db.Sequelize.Op.like]: orientador } }
            });

            if (!teacher) {
                fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
                return { success: false, error: "Professor orientador não encontrado" };
            }

            const keyword = await db.Palavra_chave.findOrCreate({
                where: { nome: palavraChave }
            });

            const document = await db.Documento.create({
                nome_doc: titulo,
                nome_arq: fileName,
                resumo,
                data,
                fk_id_discente: student.id_discente,
                fk_id_docente: teacher.id_docente,
                fk_id_doc_tipo: typeId
            });

            // Move file to type-specific directory
            moveFileToTypeDirectory(fileName, typeId);

            const docKeyword = await db.Doc_pal_chave.create({
                fk_id_palavra_chave: keyword[0].dataValues.id_palavra_chave,
                fk_id_documento: document.id_documento
            });

            return {
                success: true,
                data: {
                    msg: `Documento '${fileName}' criado com sucesso!`,
                    document,
                    docKeyword
                }
            };
        }

        // Teacher document creation
        const teacher = await db.Docente.findOne({
            where: { fk_id_usuario: userId }
        });

        if (!teacher) {
            fs.unlinkSync(`${__basedir}../../storage/${fileName}`);
            return { success: false, error: "Perfil de professor não encontrado" };
        }

        const keyword = await db.Palavra_chave.findOrCreate({
            where: { nome: palavraChave }
        });

        const document = await db.Documento.create({
            nome_doc: titulo,
            nome_arq: fileName,
            resumo,
            data,
            fk_id_docente: teacher.id_docente,
            fk_id_doc_tipo: typeId
        });

        // Move file to type-specific directory
        moveFileToTypeDirectory(fileName, typeId);

        const docKeyword = await db.Doc_pal_chave.create({
            fk_id_palavra_chave: keyword[0].dataValues.id_palavra_chave,
            fk_id_documento: document.id_documento
        });

        return {
            success: true,
            data: {
                msg: `Documento '${fileName}' criado com sucesso!`,
                document,
                docKeyword
            }
        };
    } catch (error) {
        try {
            // Try to delete file from storage - try both locations
            const fallbackPath = `${__basedir}../../storage/${fileName}`;
            if (fs.existsSync(fallbackPath)) {
                fs.unlinkSync(fallbackPath);
            }
        } catch (e) {
            // File might already be deleted
        }
        return { success: false, error: error.message };
    }
}

/**
 * Get document data for editing
 * @param {string} email - User email
 * @param {number} docId - Document ID
 * @returns {Object} Document details for editing
 */
async function getDocumentForEdit(email, docId) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: "Usuário não encontrado" };
        }

        const userId = user.id_usuario;
        const userIsStudent = isStudent(email);

        const docKeyword = await db.Doc_pal_chave.findAll({
            where: { fk_id_documento: docId },
            include: ["Palavra_chave"]
        });

        if (userIsStudent) {
            // Student edit document fetch
            const student = await db.Discente.findOne({
                where: { fk_id_usuario: userId }
            });

            if (!student) {
                return { success: false, error: "Perfil de estudante não encontrado" };
            }

            const doc = await db.Documento.findOne({
                where: {
                    id_documento: docId,
                    fk_id_discente: student.id_discente
                },
                include: ["Doc_tipo", "Docente"]
            });

            if (!doc) {
                return { success: false, error: "Documento não encontrado" };
            }

            const teachers = await db.Docente.findAll();

            return {
                success: true,
                data: {
                    msg: "Documento do Estudante",
                    userId,
                    isStudent: true,
                    doc,
                    teachers,
                    student,
                    docKeyword
                }
            };
        }

        // Teacher edit document fetch
        const teacher = await db.Docente.findOne({
            where: { fk_id_usuario: userId }
        });

        if (!teacher) {
            return { success: false, error: "Perfil de professor não encontrado" };
        }

        const doc = await db.Documento.findOne({
            where: {
                id_documento: docId,
                fk_id_docente: teacher.id_docente
            },
            include: ["Doc_tipo"]
        });

        if (!doc) {
            return { success: false, error: "Documento não encontrado" };
        }

        return {
            success: true,
            data: {
                msg: "Documento do Professor",
                userId,
                isStudent: false,
                doc,
                teacher,
                docKeyword
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Update document metadata
 * @param {string} email - User email
 * @param {number} docId - Document ID
 * @param {Object} updateData - Document update data
 * @param {Object} file - Optional uploaded file (req.file from multer)
 * @returns {Object} Updated document
 */
async function updateDocument(email, docId, updateData, file) {
    try {
        const { title, abstract, date, advisor, type, keywords } = updateData;

        const user = await db.Usuario.findOne({ where: { email } });
        if (!user) {
            return { success: false, error: "Usuário não encontrado" };
        }

        const userId = user.id_usuario;
        const userIsStudent = isStudent(email);

        const typeRecord = await db.Doc_tipo.findOne({ where: { tipo: type } });
        if (!typeRecord) {
            return { success: false, error: "Tipo de documento não encontrado" };
        }
        const typeId = typeRecord.id_doc_tipo;

        if (userIsStudent) {
            // Student update
            const student = await db.Discente.findOne({
                where: { fk_id_usuario: userId }
            });
            if (!student) {
                return { success: false, error: "Perfil de estudante não encontrado" };
            }

            const teacher = await db.Docente.findOne({
                where: { nome: { [db.Sequelize.Op.like]: advisor } }
            });
            if (!teacher) {
                return { success: false, error: "Professor orientador não encontrado" };
            }
            // Process multiple keywords
            const keywordsArr = keywords.split(",").map(p => p.trim());
            const keywordsData = [];
            for (const keyword of keywordsArr) {
                const keywordRecord = await db.Palavra_chave.findOrCreate({
                    where: { nome: keyword }
                });
                keywordsData.push(keywordRecord[0].dataValues.id_palavra_chave);
            }
            // Handle optional file upload
            if (file) {
                const document = await db.Documento.findOne({
                    where: { id_documento: docId }
                });
                const newFileName = file.filename;
                const oldFileName = document.nome_arq
                // Update document record with new filename
                await db.Documento.update(
                    {
                        nome_doc: title,
                        nome_arq: newFileName,
                        resumo: abstract,
                        data: date,
                        fk_id_docente: teacher.id_docente,
                        fk_id_doc_tipo: typeId
                    },
                    { where: { id_documento: docId, fk_id_discente: student.id_discente } }
                );
                // Move file to type-specific directory
                moveFileToTypeDirectory(newFileName, typeId);
                // Delete old file
                try {
                    const oldFilePath = getStoragePath(typeId) + oldFileName;
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                } catch (e) {
                    console.log("Could not delete old file:", e.message);
                }
            }else {
                await db.Documento.update(
                    {
                        nome_doc: title,
                        resumo: abstract,
                        data: date,
                        fk_id_docente: teacher.id_docente,
                        fk_id_doc_tipo: typeId
                    },
                    { where: { id_documento: docId, fk_id_discente: student.id_discente } }
                );
            }

            // Update keywords
            const docKeywords = [];
            for (const keywordId of keywordsData) {
                const docKeyword = await db.Doc_pal_chave.findOrCreate({
                    where: {
                        fk_id_palavra_chave: keywordId,
                        fk_id_documento: docId
                    }
                });
                docKeywords.push(docKeyword);
            }

            return {
                success: true,
                data: { msg: "Documentos do Estudante", userId, docKeywords }
            };
        }

        // Teacher update
        const teacher = await db.Docente.findOne({
            where: { fk_id_usuario: userId }
        });
        if (!teacher) {
            return { success: false, error: "Perfil de professor não encontrado" };
        }

        const keyword = await db.Palavra_chave.findOrCreate({
            where: { nome: keyword }
        });

        if (file) {
            const document = await db.Documento.findOne({
                where: { id_documento: docId }
            });
            const newFileName = file.filename;
            const oldFileName = document.nome_arq
            // Update document record with new filename
            await db.Documento.update(
                {
                    nome_doc: title,
                    resumo: abstract,
                    data: date,
                    fk_id_doc_tipo: typeId
                },
                { where: { id_documento: docId, fk_id_docente: teacher.id_docente } }
            );
            // Move file to type-specific directory
            moveFileToTypeDirectory(newFileName, typeId);
            // Delete old file
            try {
                const oldFilePath = getStoragePath(typeId) + oldFileName;
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            } catch (e) {
                console.log("Could not delete old file:", e.message);
            }
        }else {
            await db.Documento.update(
                {
                    nome_doc: title,
                    resumo: abstract,
                    data: date,
                    fk_id_doc_tipo: typeId
                },
                { where: { id_documento: docId, fk_id_docente: teacher.id_docente } }
            );
        }

        const docKeyword = await db.Doc_pal_chave.findOrCreate({
            where: {
                fk_id_palavra_chave: keyword[0].dataValues.id_palavra_chave,
                fk_id_documento: docId
            }
        });

        return {
            success: true,
            data: { msg: "Documentos do Professor", userId, docKeyword }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete document
 * @param {number} docId - Document ID
 * @returns {Object} Deletion result
 */
async function deleteDocument(docId) {
    try {
        const result = await db.Documento.destroy({
            where: { id_documento: docId }
        });

        if (result === 0) {
            return { success: false, error: "Documento não encontrado" };
        }

        return {
            success: true,
            data: { msg: "Documento apagado!", deletado: result }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getUserProfile,
    upsertUserProfile,
    getUserDocuments,
    getNewDocumentForm,
    createDocument,
    getDocumentForEdit,
    updateDocument,
    deleteDocument
};
