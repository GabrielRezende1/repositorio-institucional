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
        if(user == undefined) {
            res.status(403).json({
                err: 'Nenhuma conta cadastrada com esse email'
            });
            return;
        }

        let correctPassword = bcryptjs.compareSync(senha, user.senha);

        if(!correctPassword) {
            res.status(403).json({ err: 'Senha incorreta' });
            return;
        }

        const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: 60});
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 // Same as jwt "expiresIn"
        });
        res.json({msg: 'Você está logado', token: token});
        //res.redirect('/'); //redir to home pg if success
    })
    .catch(err => {
        res.status(501).json({
            err: { message: err.message, stack: err.stack }
        });
    });
});
//POST /cadastro
router.post('/cadastro', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    //TODO implementar o confirmeSenha
    const confirmeSenha = req.body.confirmeSenha;
    // Check if email already exists before creating user
    const user = await db.Usuario.findOne({
        where: { email: email }
    });
    // Regex email and senha
    const passwordRegex = senha.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    const emailRegex = email.match(/(([a-z]+\.[a-z]+\.[0-9]+(ga|si))@(aluno|prof).faeterj-prc.faetec.rj.gov.br)|Admin/g);
    //

    if (!user) { // If user doesn't exist, create one (user = email)
        if (!emailRegex) {
            res.status(403).json({ msg: "Email não existe!" });
            return;
        }

        if (!passwordRegex) {
            res.status(403).json({
                msg: "Senha não atende aos requisitos mínimos!", 
                requisitos: [
                    'No mínimo 8 caracteres',
                    '1 letra maiúscula',
                    '1 letra minúscula',
                    '1 caractere especial'
                ]
            });
            return;
        }

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(senha, salt);

        await db.Usuario.create({
            email,
            senha: hash,
        })
            .then((results) => {
                res.status(201).json({
                    mensagem: "Usuário cadastrado!",
                    cadastro: results
                });
                return;
            })
            .catch((err) => {
                res.status(500).json({
                    err: { message: err.message, stack: err.stack }
                });
                return;
            });
    }

    res.status(400).json({ err: 'Email já cadastrado!' });
});
//DELETE /logout
router.delete('/logout', async (req, res) => {
    if (token !== undefined) res.clearCookie('token');
})

module.exports = router;
