const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/* 
/minha-conta
/minha-conta/meus-dados
/minha-conta/favorito
/minha-conta/meus-pedidos
/minha-conta/avaliacoes
*/
router.get('/', async (req, res) => {

});

module.exports = router;