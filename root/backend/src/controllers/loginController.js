const loginService = require("../services/loginService");
const jwt = require('jsonwebtoken');

/**
 * GET /login - Verify if user token is still valid
 */
async function getLogin(req, res) {
    try {
        const token = req.cookies.token;
        const cookies = req.cookies;

        if (!token) {
            return res.status(403).json({ msg: 'Token inexistente!', cookies });
        }

        const result = loginService.verifyToken(token);

        if (!result.success) {
            res.clearCookie('token');
            return res.status(403).json({ msg: 'Token expirou!', cookies });
        }

        res.status(200).json({ token, cookies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST /login - Authenticate user with email and password
 */
async function postLogin(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const result = await loginService.loginUser(email, senha);

        if (!result.success) {
            return res.status(403).json({ err: result.error });
        }

        // Set cookie with token
        res.cookie('token', result.data.token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * PUT /login - Change user password
 */
async function putLogin(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: 'Token expirou!', token });
        }

        const decoded = jwt.decode(token);
        const { senha, novaSenha, confirmeSenha } = req.body;

        if (!senha || !novaSenha || !confirmeSenha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        if (novaSenha !== confirmeSenha) {
            return res.status(403).json({ msg: 'Você não digitou a senha nova corretamente!' });
        }

        const result = await loginService.changePassword(decoded.email, senha, novaSenha);

        if (!result.success) {
            return res.status(403).json({ msg: result.error, requisitos: result.requisitos });
        }

        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST /cadastro - Register new user
 */
async function postRegister(req, res) {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        if (password !== confirmPassword) {
            return res.status(403).json({ msg: 'Você não digitou a senha corretamente!' });
        }

        const result = await loginService.registerUser(email, password);

        if (!result.success) {
            return res.status(400).json({
                err: result.error,
                requisitos: result.requisitos
            });
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE /logout - Logout user (clear token cookie)
 */
async function deleteLogout(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            res.clearCookie('token').end();
        } else {
            res.status(400).json({ msg: 'Nenhum token encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLogin,
    postLogin,
    putLogin,
    postRegister,
    deleteLogout
};
