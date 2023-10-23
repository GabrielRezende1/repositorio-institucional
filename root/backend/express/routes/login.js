const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authSecret = 'jwtSecret';
/*
/login
/cadastro
*/
//GET /login
router.get('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.Usuario.findOne(({'email': email}))
    .then(user => {
        if(user != undefined) {
            let correctPassword = bcryptjs.compareSync(senha, user.senha);
            
            if(correctPassword) {
                let token = jwt.sign({email: email}, authSecret, {expiresIn: '1h'})
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
        res.statusCode = 501;
        res.json({err: err});
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
        console.log(user);
        console.log('emailRegex: ' + emailRegex);
        console.log('passwordRegex: ' + passwordRegex);

        res.statusCode = 400;
        res.json({ errorAlt: 'Email já cadastrado!' });
    } else {
        console.log(user);
        console.log('emailRegex: ' + emailRegex);
        console.log('passwordRegex: ' + passwordRegex);

        if (!emailRegex) {
            res.statusCode = 403;
            res.json({ msg: "Email não existe!" });
            return;
        }

        if (!passwordRegex) {
            res.statusCode = 403;
            res.json({ msg: "Senha não atende aos requisitos mínimos!", 
            requisitos: [
                'no mínimo 8 caracteres',
                '1 letra maiúscula',
                '1 letra minúscula',
                '1 caractere especial'
            ]});
            return;
        }

        let salt = bcryptjs.genSaltSync(10);
        let hash = bcryptjs.hashSync(senha, salt);

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

module.exports = router;