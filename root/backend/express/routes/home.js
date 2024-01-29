require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
	/
	/apresentacao
	/politicas
	/politicas/:id/:nome
	/faq
 */
//TODO search bar (usando wildcard % da db) e link para os filtros de documentos
//GET home
router.get("/", async (req, res) => {
	const doctypes = await db.Doc_tipo.findAll({
		attributes: ["tipo"],
		where: {
			"tipo": {
				[db.Sequelize.Op.and]: [ //operator and
					{[db.Sequelize.Op.ne]: "Política"}, //ne = not equal to
					{[db.Sequelize.Op.ne]: "Tutorial"}
				]
			}
		}
	});

	//Query code
	let query = req.query;
	if(!(query.search == undefined)) { //only search db if query exists
		console.log("Query existe!");
		console.log(query.search);
	}

	res.json({
		msg: "Rota '/' alcançada!", 
		data: doctypes,
		query
	});
});
//GET /apresentacao
router.get("/apresentacao", async(req, res) => { //TODO simples apresentação em html
	res.json({
		msg: "Rota '/apresentacao' alcançada!",
		apresentacao: "Inserir apresentação"
	});
});
//GET /faq
router.get("/faq", async(req, res) => { //TODO simples apresentação em html
	res.json({
		msg: "Rota '/apresentacao' alcançada!",
		faq: "Inserir FAQ"
	});
});
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
	const politicaID = await db.Doc_tipo.findOne({ //Find policy ID on the table
		where: {
			"tipo": "Política"
		}
	});

	const politica = await db.Documento.findOne({ //Retrieve policy doc
		where: {
			"fk_id_doc_tipo": politicaID.id_doc_tipo //Table column id
		}
	});

	res.json({
		msg: `Rota '/politicas/${req.params.id}' alcançada!`, 
		politicaID: politicaID.id_doc_tipo, 
		politica
	});
});
//TODO documento da política
//GET /politicas/:id/:nome
router.get("/politicas/:id/:nome", async (req, res) => {
    const id = req.params.id;
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