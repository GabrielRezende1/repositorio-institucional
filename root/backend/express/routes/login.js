require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../../db/models/index");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * /login
 * /cadastro
 * /logout
 */
//GET /login
router.get('/login', async (req, res) => {
    const token = req.cookies.token;
    const cookies = req.cookies;
    if (token) {
        try {
            const check = jwt.verify(token, process.env.JWT_SECRET);
            console.log(check);
            if (check) {
                res.status(200).json({token, cookies});
                return;
            }
        } catch (error) {
            res.clearCookie('token');
            res.status(403).json({msg: 'Token expirou!', cookies});
        }
    }else {
        res.status(403).json({msg: 'Token inexistente!', cookies: req.cookies});
    }
});
//POST /login
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

        const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.json({msg: 'Você está logado', token: token});
    })
    .catch(err => {
        res.status(501).json({
            err: { message: err.message, stack: err.stack }
        });
    });
});
//PUT /login (Should be a PUT /login)
router.put('/login', async (req, res) => {
    console.log('put login alcançado');
    const token = req.cookies.token;
    const decoded = jwt.decode(token);
    const email = decoded.email;

    if (!token) {
        res.status(401).json({msg: 'Token expirou!', token});
        return;
    }

    const user = await db.Usuario.findOne({
        where: {email}
    });
    const userId = user.id_usuario;
    const userPwd = user.senha;

    const oldPwd = req.body.senha;
    const newPwd = req.body.novaSenha;
    const checkPwd = req.body.confirmeSenha;
    // Regex senha
    const pwdRegex = newPwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    //
    if (!pwdRegex) {
        res.status(403).json({
            msg: "Senha não atende aos requisitos mínimos!",
            requisitos: [
                "No mínimo 8 caracteres",
                "1 letra maiúscula",
                "1 letra minúscula",
                "1 caractere especial"
            ]
        });
        return;
    }

    if (newPwd != checkPwd) {
        res.status(403).json({
            msg: "Você não digitou a senha nova corretamente!"
        });
        return;
    }

    const correctPassword = bcryptjs.compareSync(oldPwd, userPwd);

    if (!correctPassword) {
        res.status(403).json({msg: 'Você não digitou a senha corretamente!'});
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(newPwd, salt);

    const newUser = await db.Usuario.upsert({
        id_usuario: userId,
        email,
        senha: hash
    });

    res.status(200).json({ msg: 'Senha alterada com sucesso!', correctPassword, newUser });
})
//POST /cadastro
router.post('/cadastro', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const confirmeSenha = req.body.confirmeSenha;
    // Check if email already exists before creating user
    const user = await db.Usuario.findOne({
        where: { email: email }
    });
    // Regex email and senha
    const passwordRegex = senha.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    const emailRegex = email.match(/([a-z]+\.[a-z]+\.[0-9]+(ga|si))@(aluno|prof).faeterj-prc.faetec.rj.gov.br/g);
    //

    if (user) { // If user doesn't exist, create one (user = email)
        res.status(400).json({ err: 'Email já cadastrado!' });
        return;
    }

    if (!emailRegex) {
        res.status(403).json({ msg: "Email não existe!" });
        return;
    }

    if (!passwordRegex) {
        res.status(403).json({
            msg: "Senha não atende aos requisitos mínimos!",
            requisitos: [
                "No mínimo 8 caracteres",
                "1 letra maiúscula",
                "1 letra minúscula",
                "1 caractere especial"
            ]
        });
        return;
    }

    if (senha != confirmeSenha) {
        res.status(403).json({
            msg: "Você não digitou a senha corretamente!"
        });
        return;
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(senha, salt);

    await db.Usuario.create({
        email,
        senha: hash
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
});
//DELETE /logout
router.delete('/logout', async (req, res) => {
    const token = req.cookies.token;
    if (token) res.clearCookie('token').end();
})

module.exports = router;
