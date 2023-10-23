const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
/carrinho
/pagamento
/confirmacao
*/
//GET /carrinho
router.get('/carrinho', async (req, res) => {

});
//POST /carrinho
router.post('/carrinho', async (req, res) => {

    res.redirect('/'); //redir to /pagamento if success
});
//GET /pagamento
router.get('/pagamento', async (req, res) => {

});
//POST /pagamento
router.post('/pagamento', async (req, res) => {

    res.redirect('/confirmacao'); //redir to /confirmacao if success
});
//GET /confirmacao
router.get('/confirmacao', async (req, res) => {

});

module.exports = router;