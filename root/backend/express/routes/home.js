const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
	/
	/apresentacao
	/politicas
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

module.exports = router;