require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const idParam = require("../middlewares/idParam");
/**
 * /politicas
 * /politicas/:id
 * /politicas/:id/:nome
 */
//GET /politicas
router.get("/politicas", async (req, res) => {
	//Find policy ID on the table
	const politicaID = await db.Doc_tipo.findOne({
		where: { tipo: "Política" }
	});
	//Retrieve all policy docs
	const politicas = await db.Documento.findAll({
		where: { fk_id_doc_tipo: politicaID.id_doc_tipo }
	});

	res.json({ politicas });
});
//GET /politicas/:id
router.get("/politicas/:id", async (req, res) => {
	const id = idParam(req);
	//Find policy ID on the table
	const politicaID = await db.Doc_tipo.findOne({
		where: {
			"tipo": "Política"
		}
	});
	//Retrieve policy doc
	const politica = await db.Documento.findOne({
		where: {
			id_documento: id,
			fk_id_doc_tipo: politicaID.id_doc_tipo
		}
	});

	res.json({ politica });
});
//GET /politicas/:id/:nome (DOWNLOAD)
router.get("/politicas/:id/:nome", async (req, res) => {
    const id = idParam(req);
    const fileName = req.params.nome;

    const politica = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: {
            id_documento: id,
            nome_arq: fileName,
            fk_id_doc_tipo: 9
        }
    });

    if (!politica) {
        res.status(400).json({ erro: "Não foi possível recuperar os dados!" });
        return;
    }

    const directoryPath = __basedir + "../../db/documents/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "There was an issue in downloading the file. " + err
            });
        }
    });
});

module.exports = router;
