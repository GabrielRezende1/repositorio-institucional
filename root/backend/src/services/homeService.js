const db = require("../config/index");

/**
 * Get all document types excluding specific types (Política, Tutorial)
 * @returns {Promise} List of document types
 */
async function getDocumentTypes() {
    try {
        const doctypes = await db.Doc_tipo.findAll({
            where: {
                tipo: {
                    [db.Sequelize.Op.and]: [
                        { [db.Sequelize.Op.ne]: "Política" },
                        { [db.Sequelize.Op.ne]: "Tutorial" }
                    ]
                }
            }
        });
        return { success: true, data: doctypes };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Get institutional presentation data
 * @returns {Object} Presentation information
 */
function getPresentation() {
    return {
        apresentacao: "Bem-vindo ao repositório institucional da FAETERJ-Paracambi.",
        missao: "Armazenar, preservar, divulgar e oferecer acesso à produção científica e institucional da FAETERJ-Paracambi.",
        objetivo: "Contribuir para o aumento da visibilidade da produção científica da FAETERJ-Paracambi; Preservar a memória intelectual da faculdade; Reunir em um único local virtual e de forma permanente a produção científica e institucional; Disponibilizar o livre acesso aos conteúdos digitais; Ampliar e facilitar o acesso à produção científica de uma forma geral."
    };
};

/**
 * Get FAQ data
 * @returns {Object} FAQ questions and answers
 */
function getFAQ() {
    return {
        q1: "O que é um Repositório Institucional?",
        a1: "Um Repositório Institucional é um ambiente digital dedicado ao armazenamento, acesso, divulgação e preservação da produção intelectual de uma instituição.",
        q2: "Quais são os objetivos do Repositório Institucional da FAETERJ-PRC?",
        a2: "Unificar em plataforma comum a produção intelectual da Faculdade de forma a maximizar a visibilidade e o acesso; preservar e conservar a produção intelectual da Faculdade; potencializar o intercâmbio da FAETERJ-Paracambi com outras instituições com vistas a promover a democratização do conhecimento.",
        q3: "Quais documentos são disponibilizados no RI-FAETERJ-PRC?",
        a3: "Inicialmente, serão disponibilizados no Repositório: artigos de periódicos e de eventos; livros, capítulos de livros; dissertações; monografias; trabalhos de conclusão de curso, teses; tutoriais e políticas do site."
    };
};

async function getPolicies() {
    try {
        const policies = await db.Documento.findAll({
                where: { fk_id_doc_tipo: 9 } //Imutable doc_type id
            });
        return {success: true, data: policies};
    } catch (error) {
        return {success: false, error: error.message};
    }
}

async function getPolicyDownload(fileName) {
    try {
        const policy = await db.Documento.findOne({
            attributes: ["nome_doc", "nome_arq", "resumo", "data"],
            where: {
                nome_arq: fileName,
                fk_id_doc_tipo: 9
            }
        });

        if (!policy) {
            return {success: false, error: "Policy doesn't exist. Policy file name could be wrong, or the policies storage is empty."};
        }

        const directoryPath = __basedir + "../../storage/policies/";

        return {success: true, data: policy, directoryPath};
    } catch (error) {
        return {success: false, error: error.message};
    }
}

async function getTutorial() {
    try {
        const tutorials = await db.Documento.findAll({
            where: { fk_id_doc_tipo: 10 }
        });

        if (!tutorials) {
            return {success: false, error: "Não foi possível recuperar os arquivos de tutorial."};
        }

        return {
            success: true,
            data: {
                tutorials,
                text: {
                    login: "Apenas integrantes da instituição podem se cadastrar para publicarem seus trabalhos. Caso você seja um aluno/professor da FAETERJ-PRC, você pode fazer o cadastro de usuário com o seu e-mail institucional.",
                    documentos: "Atualmente só são aceitos documentos em PDF para upload dos trabalhos (de até 10MB em tamanho). Portanto, antes de publicá-lo, tenha certeza de ter convertido seu documento em PDF."
                }
            }
        };
    } catch (error) {
        return {success: false, error: error.message};
    }
}

async function getTutorialDownload(fileName) {
    try {
        const tutorial = await db.Documento.findOne({
            attributes: ["nome_doc", "nome_arq", "resumo", "data"],
            where: {
                nome_arq: fileName,
                fk_id_doc_tipo: 10
            }
        });

        if (!tutorial) {
            return {success: false, error: "Tutorial doesn't exist. Tutorial file name could be wrong, or the tutorials storage is empty."}
        }

        const directoryPath = __basedir + "../../storage/tutorials/";

        return {success: true, data: tutorial, directoryPath};
    } catch (error) {
        return {success: false, error: error.message};
    }
}

module.exports = {
    getDocumentTypes,
    getPresentation,
    getFAQ,
    getPolicies,
    getPolicyDownload,
    getTutorial,
    getTutorialDownload
};
