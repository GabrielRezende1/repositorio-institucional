const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const fileCtrl = require("../middlewares/file.controller");
/*
/documento
/documento/:tipo
/documento/:id
/documento/:id/:nome
*/
//GET /documento
router.get("/documento", async (req, res) => {
    console.log("Rota GET /documento alcançada!");

    //Limit the amount of documents shown on page
    const { page = 1 } = req.query;
    console.log("Page: " + page);
    const limit = 2; //Ideal is 40
    let lastPage = 1;
    const countDocument = await db.Documento.count(); // .findAndCountAll()
    console.log("Document quantity: " + countDocument);

    if (countDocument !== 0) {
        lastPage = Math.ceil(countDocument / limit);
        console.log("lastPage: " + lastPage);
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    console.log(page * limit - limit);

    //Retrieve all documents stored in the database using Sequelize
    const documentos = await db.Documento.findAll({
        attributes: ["id_documento", "nome_doc", "nome_arq", "resumo", "data"], //Choose which column to show
        order: [["id_documento", "ASC"]], //Choose order
        //Return the specific startpoint of documents and the limit of them on the page
        offset: Number(page * limit - limit),
        limit: limit,
    });

    if (documentos) {
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
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});
//TODO alterar função para se adequar ao de uma requisição de documento de tipo específico
//GET /documento/:tipo
router.get("/documento/:tipo", async (req, res) => {
    console.log("Rota GET /documento/:id alcançada!");

    const id = req.params.id;

    const documento = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { id_documento: id },
    });

    if (documento) {
        res.status(200).json({
            mensagem: "Rota documento alcançada!",
            data: documento
        });
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});
//TODO alterar função para se adequar ao de uma requisição de documento específico
//GET /documento/:id
router.get("/documento/:id", async (req, res) => {
    console.log("Rota GET /documento/:id alcançada!");

    const id = req.params.id;

    const documento = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { id_documento: id },
    });

    if (documento) {
        res.status(200).json({
            mensagem: "Rota documento alcançada!",
            data: documento
        });
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});
// Download do documento específico
//GET /documento/:id/:nome
router.get("/documento/:id/:nome", async (req, res) => {
    console.log("Rota GET /documento/:id/:nome alcançada!");

    const id = req.params.id;
    const fileName = req.params.nome;

    const documento = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: { 
            id_documento: id,
            nome_arq: fileName
        }
    });

    if (documento) {
        const directoryPath = __basedir + "../../db/documents/";
        res.download(directoryPath + fileName, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "There was an issue in downloading the file. " + err,
                });
            }
        });
    } else {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
    }
});
//TODO alterar função para se adequar ao de uma inserção de documento
//POST /documento
router.post("/documento", async (req, res) => {
    console.log("Rota POST /documento alcançada!");

    //const dados = req.body; //req.body only because it's json content-type (nome / resumo / data)

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const empresa = req.body.empresa;

    await db.Documento.create({
        nome,
        sobrenome,
        empresa,
    })
        .then((results) => {
            res.statusCode = 200;
            res.json({ mensagem: "Documento cadastrado!", cadastrado: results });
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({ error: err });
        });
});
//TODO alterar função para se adequar ao de uma requisição de alteração de documento
//PUT /documento/:id
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const empresa = req.body.empresa;

    await db.Documento.update(
        {
            nome: nome,
            sobrenome: sobrenome,
            empresa: empresa,
        },
        { where: { id_documento: id } }
    )
        .then((results) => {
            res.status(200).json({
                mensagem: "Documento alterado!",
                alteração: results,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});
//DELETE /documento/:id
router.delete("documento/:id", async (req, res) => {
    const id = req.params.id;

    await db.Documento.destroy({
        where: { id_documento: id },
    })
        .then((results) => {
            res.statusCode = 200;
            res.json({ mensagem: "Documento apagado!", deletado: results });
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({ error: err });
        });
});

module.exports = router;
