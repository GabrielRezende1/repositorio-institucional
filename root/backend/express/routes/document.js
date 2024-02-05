const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const idParam = require("../middlewares/idParam");
/**
 * /documento
 * /documento/:tipo
 * /documento/:id
 * /documento/:id/:nome
 * 
 * OBS: Document creation is handled by the user.js
 * since only logged users can create/update docs
 */
//GET /documento
router.get("/documento", async (req, res) => {
    //Limit the amount of documents shown on page
    const { page = 1 } = req.query;
    console.log(req.query);
    const limit = 3; //Num. of records per page. Ideal is 40
    let lastPage = 1;
    // Get all records if search is empty|undefined
    let docs;
    if (!req.query.search) {
        docs = await db.Documento.findAndCountAll({
            attributes: ["id_documento", "nome_doc", "nome_arq", "resumo", "data"],
            order: [["data", "ASC"]],
            where: {
                fk_id_doc_tipo: {
                    [db.Sequelize.Op.and]: [ //operator and
                        {[db.Sequelize.Op.ne]: 9}, //ne = not equal to
                        {[db.Sequelize.Op.ne]: 10}
                    ]
                }
            },
            offset: Number(page * limit - limit),
            limit,
        });
    }else {
        docs = await db.Documento.findAndCountAll({
            attributes: ["id_documento", "nome_doc", "nome_arq", "resumo", "data"],
            where: {
                nome_doc: {
                    [db.Sequelize.Op.like]: `%${req.query.search}%`
                },
                fk_id_doc_tipo: {
                    [db.Sequelize.Op.and]: [ //operator and
                        {[db.Sequelize.Op.ne]: 9}, //ne = not equal to
                        {[db.Sequelize.Op.ne]: 10}
                    ]
                }
            },
            order: [["nome_doc", "ASC"], ["data", "ASC"]],
            offset: Number(page * limit - limit),
            limit,
        });
    }

    if (!docs) {
        res.status(500).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    const docCount = docs.count;
    const docRows = docs.rows;

    if (docCount == 0) {
        res.status(400).json({
            erro: `Não encontramos nenhum documento com '${req.query.search}'`
        });
        return;
    }
    
    lastPage = Math.ceil(docCount / limit);

    const pagination = {
        path: "/documento",
        page: page,
        prev_page_url: Number(page) - 1 >= 1 ? Number(page) - 1 : false,
        next_page_url: Number(page) + 1 > lastPage ? false : Number(page) + 1,
        lastPage: lastPage,
        total_documents: docCount,
    };

    res.status(200).json({
        docRows,
        pagination,
    });
});
// Recupera documentos de um tipo específico do db
//GET /documento/:tipo
router.get("/documento/:tipo", async (req, res) => {
    const tipo = req.params.tipo;
    const docTipo = await db.Doc_tipo.findOne({
        where: { tipo }
    });

    const docTipoId = docTipo.id_doc_tipo;

    const documento = await db.Documento.findAll({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { fk_id_doc_tipo: docTipoId },
    });

    if (!documento) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    res.status(200).json({
        mensagem: "Rota documento alcançada!",
        data: documento
    });
});
//TODO alterar função para se adequar ao de uma requisição de documento específico
//GET /documento/:id
router.get("/documento/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    const documento = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { id_documento: id },
    });

    if (!documento) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    res.status(200).json({
        mensagem: "Rota documento alcançada!",
        data: documento
    });
});
// Download do documento específico
//GET /documento/:id/:nome
router.get("/documento/:id/:nome", async (req, res) => {
    const id = idParam(req);
    const fileName = req.params.nome;

    const documento = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { 
            id_documento: id,
            nome_arq: fileName
        }
    });

    if (!documento) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    const directoryPath = __basedir + "../../db/documents/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "There was an issue in downloading the file. " + err,
            });
        }
    });
});

module.exports = router;
