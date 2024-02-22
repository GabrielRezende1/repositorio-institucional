require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const idParam = require("../middlewares/idParam");
/**
 * /politicas
 * /politicas/:nome
 */
//GET /politicas
router.get("/politicas", async (req, res) => {
	//Retrieve all policy docs
	const politicas = await db.Documento.findAll({
		where: { fk_id_doc_tipo: 9 } //Imutable doc_type id
	});

	res.json({ politicas });
});
//GET /politicas/:nome (DOWNLOAD)
router.get("/politicas/:nome", async (req, res) => {
    const fileName = req.params.nome;

    const politica = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: {
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
