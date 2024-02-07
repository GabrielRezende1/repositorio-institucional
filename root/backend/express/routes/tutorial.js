require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const idParam = require("../middlewares/idParam");
/**
 * /tutorial/geral
 * /tutorial/documentos
 * /tutorial/documentos/:id
 */
//TODO simples apresentação em html: regras de login e formatação (em pdf)/tamanho do documento
//GET /tutorial/geral
router.get("/tutorial/geral", async (req, res) => {
    res.json({ msg: "Rota '/tutorial/regras-login' alcançada!" });
});
//TODO requisição dos documentos de tutorial pelo banco de dados e possível download ou exibição online do mesmo
//GET /tutorial/documentos
router.get("/tutorial/documentos", async (req, res) => {
    res.json({ msg: "Rota '/tutorial/documentos' alcançada!" });
});
//GET /tutorial/documentos/:id
router.get("/tutorial/documentos/:id", async (req, res) => {
    const id = idParam(req);
    res.json({ msg: "Rota '/tutorial/documentos' alcançada!" });
});
module.exports = router;
