require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
	/
	/apresentacao
	/politicas
	/politicas/:id
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
//TODO documento da política
//GET /politicas/:id
router.get("/politicas/:id", async (req, res) => {
	const politica = await db.Documento.findOne({
		where: {
			"id_documento": req.params.id,
			"fk_id_doc_tipo": 9, // Policy id by document
		}
	});
	res.json({
		msg: `Rota '/politicas/${req.params.id}' alcançada!`,
		politica
	});
});

module.exports = router;