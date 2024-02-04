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
    console.log("Page: " + page);
    const limit = 2; //Ideal is 40
    let lastPage = 1;
    const countDocument = await db.Documento.count(); // .findAndCountAll()
    console.log("Document quantity: " + countDocument);

    if (countDocument == 0) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }
    lastPage = Math.ceil(countDocument / limit);
    console.log("lastPage: " + lastPage);

    console.log(page * limit - limit);

    //Retrieve all documents stored in the database using Sequelize
    const documentos = await db.Documento.findAll({
        attributes: ["id_documento", "nome_doc", "nome_arq", "resumo", "data"], //Choose which column to show
        order: [["id_documento", "ASC"]], //Choose order
        //Return the specific startpoint of documents and the limit of them on the page
        offset: Number(page * limit - limit),
        limit: limit,
    });

    if (!documentos) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    const pagination = {
        path: "/documento",
        page: page,
        prev_page_url: Number(page) - 1 >= 1 ? Number(page) - 1 : false,
        next_page_url:
            Number(page) + 1 > lastPage ? false : Number(page) + 1,
        lastPage: lastPage,
        total_documents: countDocument,
    };

    res.status(200).json({
        mensagem: "Rota documento alcançada!",
        data: documentos,
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
