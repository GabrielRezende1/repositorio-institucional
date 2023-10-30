const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const authToken = require('../auth');
/* 
/minha-conta
/minha-conta/meus-dados
/minha-conta/favorito
/minha-conta/meus-pedidos
/minha-conta/avaliacoes
*/
router.get('/minha-conta', authToken, async (req, res) => {
    res.status(200).json({msg: 'Path "/minha-conta" reached!'});
});

module.exports = router;