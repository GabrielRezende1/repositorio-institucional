require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
/*
/login
/cadastro
/logout
*/
//GET /login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.Usuario.findOne({
        where: {email: email}
    })
    .then(user => {
        if(user != undefined) {
            let correctPassword = bcryptjs.compareSync(senha, user.senha);
            
            if(correctPassword) {
                const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: 60});
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 1000 * 60 // Same as jwt "expiresIn"
                });
                res.json({msg: 'Você está logado', token: token});
                //res.redirect('/'); //redir to home pg if success
            }else {
                res.statusCode = 403;
                res.json({err: 'Senha incorreta', correctPassword: correctPassword, user: user});
            }
        }else {
            res.statusCode = 403;
            res.json({err: 'Nenhuma conta cadastrada com esse email'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(501).json({errAlt: 'Error, see terminal log if no err', err: err});
    });
});

//POST /cadastro
router.post('/cadastro', async (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const confirmeSenha = req.body.confirmeSenha;
    // Check if email already exists before creating user
    const user = await db.Usuario.findOne({
        where: { email: email }
    });
    // Regex email and senha
    const passwordRegex = senha.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    const emailRegex = email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    //

    if (user) { // If user exists, doesn't create one (user = email)
        res.statusCode = 400;
        res.json({ errorAlt: 'Email já cadastrado!' });
    } else {
        if (!emailRegex) {
            res.statusCode = 403;
            res.json({ msg: "Email não existe!" });
            return;
        }

        if (!passwordRegex) {
            res.statusCode = 403;
            res.json({ msg: "Senha não atende aos requisitos mínimos!", 
            requisitos: [
                'No mínimo 8 caracteres',
                '1 letra maiúscula',
                '1 letra minúscula',
                '1 caractere especial'
            ]});
            return;
        }

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(senha, salt);

        await db.Usuario.create({
            nome,
            email,
            senha: hash,
        })
            .then((results) => {
                res.statusCode = 201;
                res.json({ mensagem: "Usuário cadastrado!", cadastro: results });
            })
            .catch((err) => {
                res.statusCode = 500;
                res.json({ error: err, errorAlt: 'Não foi possível cadastrar o usuário!' });
            });
    }

    //res.redirect('/'); //redir to home pg ('/') if success
});
//DELETE /logout
router.delete('/logout', async (req, res) => {
    
})

module.exports = router;