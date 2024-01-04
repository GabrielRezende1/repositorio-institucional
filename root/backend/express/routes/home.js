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
//GET home
router.get("/", async (req, res) => { //TODO search bar e link para os filtros de documentos
    res.json({msg: "Rota '/' alcançada!"});
});
//GET /apresentacao
router.get("/apresentacao", async(req, res) => { //TODO simples apresentação em html
	res.json({msg: "Rota '/apresentacao' alcançada!"});
});
//GET /faq
router.get("/faq", async(req, res) => { //TODO simples apresentação em html
	res.json({msg: "Rota '/apresentacao' alcançada!"});
});
//GET /politicas
router.get("/politicas", async (req, res) => { //TODO links para as políticas
	res.json({msg: "Rota '/politicas' alcançada!"});
});
//GET /politicas/:id
router.get("/politicas/:id", async (req, res) => { //TODO documentos das políticas
	res.json({msg: "Rota '/politicas/:id' alcançada!"});
});

module.exports = router;