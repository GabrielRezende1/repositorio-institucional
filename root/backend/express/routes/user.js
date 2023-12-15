const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const authToken = require('../auth');
const jwt = require('jsonwebtoken');
/* 
/minha-conta
/minha-conta/meus-dados
*/
//GET /minha-conta
router.get('/minha-conta', authToken, async (req, res) => {
    try {
        //const userId = helper.getUserById(req); //TODO "req." is not defined

        const token = req.cookies.token;
        const decoded = jwt.decode(token);
        const email = decoded.email;
    
        const userIdJson = await db.Usuario.findOne({
            attributes: ['id_usuario'],
            where: {email}
        });
        const userId = userIdJson.id_usuario;
        res.json(userId);
    } catch (error) {
        console.log(error);
        res.json({error});
    }
    //res.status(200).json({msg: 'Path /minha-conta reached!'});
});
//GET /minha-conta/meus-dados
router.get('/minha-conta/meus-dados', authToken, async (req, res) => {
    res.status(200).json({msg: 'Path /minha-conta reached!'});
});

module.exports = router;