const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const authToken = require('../auth');
const jwt = require('jsonwebtoken');
/* 
/minha-conta
/minha-conta/meus-documentos
*/
//TODO requisição dos dados de usuário e discente/docente pelo banco de dados
//GET /minha-conta
router.get('/minha-conta', authToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;
    
        const userIdJson = await db.Usuario.findOne({
            attributes: ['id_usuario'],
            where: {email}
        });
        const userId = userIdJson.id_usuario;
        res.status(200).json({msg: "Path /minha-conta reached!", userId});
    } catch (error) {
        console.log(error);
        res.status(401).json({error});
    }
});
//TODO requisição dos documentos do usuário pelo banco de dados
//GET /minha-conta/meus-documentos
router.get('/minha-conta/meus-documentos', authToken, async (req, res) => {
    res.status(200).json({msg: 'Path /minha-conta/meus-documentos reached!'});
});

module.exports = router;