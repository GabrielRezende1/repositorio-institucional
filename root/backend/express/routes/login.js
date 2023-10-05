const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
/*
/login
/cadastro
*/
//GET /login
router.get('/login', async (req, res) => {

});
//POST /login
router.post('/login', async (req, res) => {

    res.redirect('/'); //redir to home pg if success
});
//GET /cadastro
router.get('/cadastro', async (req, res) => {

});
//POST /cadastro
router.post('/cadastro', async (req, res) => {

    res.redirect('/'); //redir to home pg ('/') if success
});

module.exports = router;