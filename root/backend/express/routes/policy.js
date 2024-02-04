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
router.get("/politicas", async (req, res) => { //TODO links para as políticas
	const politicaID = await db.Doc_tipo.findOne({ //Find policy ID on the table
		where: {
			"tipo": "Política"
		}
	});

	const politicas = await db.Documento.findAll({ //Retrieve all policy docs
		where: {
			"fk_id_doc_tipo": politicaID.id_doc_tipo //Table column id
		}
	});

	res.json({
		msg: "Rota '/politicas' alcançada!", 
		politicaID: politicaID.id_doc_tipo, 
		politicas
	});
});
//GET /politicas/:id
router.get("/politicas/:id", async (req, res) => {
	const id = idParam(req);

	const politicaID = await db.Doc_tipo.findOne({ //Find policy ID on the table
		where: {
			"tipo": "Política"
		}
	});

	const politica = await db.Documento.findOne({ //Retrieve policy doc
		where: {
			id_documento: id,
			fk_id_doc_tipo: politicaID.id_doc_tipo //Table column id
		}
	});

	res.json({
		msg: `Rota '/politicas/${id}' alcançada!`, 
		politicaID: politicaID.id_doc_tipo, 
		politica
	});
});
// Download de documento da política
//GET /politicas/:id/:nome
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
                message: "There was an issue in downloading the file. " + err,
            });
        }
    });
});

module.exports = router;