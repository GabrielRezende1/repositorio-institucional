require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const idParam = require("../middlewares/idParam");
/**
 * /tutorial/geral
 * /tutorial/documentos
 * /tutorial/documentos/:nome
 */
//GET /tutorial/geral
router.get("/tutorial/geral", async (req, res) => {
    res.json({
        login: "Apenas integrantes da instituição podem se cadastrar para publicarem seus trabalhos. Caso você seja um aluno/professor da FAETERJ-PRC, você pode fazer o cadastro de usuário com o seu e-mail institucional.",
        documentos: "Atualmente só são aceitos documentos em PDF para upload dos trabalhos (de até 4MB em tamanho). Portanto, antes de publicá-lo, tenha certeza de ter convertido seu documento em PDF."
    });
});
//GET /tutorial/documentos
router.get("/tutorial/documentos", async (req, res) => {
	//Retrieve all tutorial docs
	const tutorials = await db.Documento.findAll({
		where: { fk_id_doc_tipo: 10 } //Imutable doc_type id
	});

	res.json({ tutorials });
});
//GET /tutorial/documentos/:nome
router.get("/tutorial/documentos/:nome", async (req, res) => {
    const fileName = req.params.nome;

    const tutorial = await db.Documento.findOne({
        attributes: ["nome_doc", "nome_arq", "resumo", "data"],
        where: {
            nome_arq: fileName,
            fk_id_doc_tipo: 10
        }
    });

    if (!tutorial) {
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
