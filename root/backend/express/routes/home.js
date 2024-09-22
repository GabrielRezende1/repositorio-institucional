const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/**
 * /
 * /apresentacao
 * /politicas
 * /faq
 */
//GET home
router.get("/", async (req, res) => {
	const doctypes = await db.Doc_tipo.findAll({
		where: {
			tipo: {
				[db.Sequelize.Op.and]: [ //operator and
					{[db.Sequelize.Op.ne]: "Política"}, //ne = not equal to
					{[db.Sequelize.Op.ne]: "Tutorial"}
				]
			}
		}
	});
	// Only search db if query exists
	if(req.query.search == undefined) {
		res.status(200).json({ doctypes, documentTypes });
		return;
	}

	res.redirect(`/api/documento/?search=${req.query.search}`);
});
//GET /apresentacao
router.get("/apresentacao", async(req, res) => {
	res.json({
		apresentacao: "Bem-vindo ao repositório institucional da FAETERJ-Paracambi.",
		missao: "Armazenar, preservar, divulgar e oferecer acesso à produção científica e institucional da FAETER-Paracambi.",
		objetivo: "Contribuir para o aumento da visibilidade da produção científica da FAETERJ-Paracambi; Preservar a memória intelectual da faculdade; Reunir em um único local virtual e de forma permanente a produção científica e institucional; Disponibilizar o livre acesso aos conteúdos digitais; Ampliar e facilitar o acesso à produção científica de uma forma geral."
	});
});
//GET /faq
router.get("/faq", async(req, res) => {
	res.json({
		q1: "O que é um Repositório Institucional?",
		a1: "Um Repositório Institucional é um ambiente digital dedicado ao armazenamento, acesso, divulgação e preservação da produção intelectual de uma instituição.",
		q2: "Quais são os objetivos do Repositório Institucional da FAETER-Paracambi(RI-FAETERJ-PRC)?",
		a2: "Unificar em plataforma comum a produção intelectual da Faculdade de forma a maximizar a visibilidade e o acesso; preservar e conservar a produção intelectual da Faculdade; potencializar o intercâmbio da FAETERJ-Paracambi com outras instituições com vistas a promover a democratização do conhecimento.",
		q3: "Quais documentos são disponibilizados no RI-FAETERJ-PRC?",
		a3: "Inicialmente, serão disponibilizados no Repositório: artigos de periódicos e de eventos; livros, capítulos de livros; dissertações; monografias; trabalhos de conclusão de curso, teses; tutoriais e políticas do site."
	});
});

module.exports = router;
