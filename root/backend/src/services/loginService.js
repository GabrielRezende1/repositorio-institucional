require('dotenv').config();
const db = require("../config/index");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Regex patterns
const EMAIL_REGEX = /([a-z]+\.[a-z]+\.[0-9]+(ga|si))@(aluno|prof).faeterj-prc.faetec.rj.gov.br/g;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,24}$/gm;

/**
 * Verify if JWT token is still valid
 * @param {string} token - JWT token
 * @returns {Object} Verification result
 */
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: 'Token inválido ou expirado' };
    }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} senha - User password
 * @returns {Object} Login result with token if successful
 */
async function loginUser(email, senha) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: 'Nenhuma conta cadastrada com esse email.' };
        }

        const correctPassword = bcryptjs.compareSync(senha, user.senha);

        if (!correctPassword) {
            return { success: false, error: 'Senha incorreta.' };
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return {
            success: true,
            data: {
                msg: 'Login realizado com sucesso!',
                token
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Validate password requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
    const isValid = password.match(PASSWORD_REGEX);
    
    if (!isValid) {
        return {
            success: false,
            error: 'Senha não atende aos requisitos mínimos!',
            requisitos: [
                'No mínimo 8 caracteres',
                'Pelo menos uma letra maiúscula',
                'Pelo menos uma letra minúscula',
                'Pelo menos um caractere especial',
                'Sem espaços entre caracteres',
                'No máximo 24 caracteres'
            ]
        };
    }

    return { success: true };
};

/**
 * Change user password
 * @param {string} email - User email
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} Password change result
 */
async function changePassword(email, oldPassword, newPassword) {
    try {
        const user = await db.Usuario.findOne({ where: { email } });

        if (!user) {
            return { success: false, error: 'Usuário não encontrado.' };
        }

        // Verify old password
        const correctPassword = bcryptjs.compareSync(oldPassword, user.senha);

        if (!correctPassword) {
            return { success: false, error: 'Você não digitou a senha corretamente!' };
        }

        // Validate new password format
        const validation = validatePassword(newPassword);
        if (!validation.success) {
            return validation;
        }

        // Hash and save new password
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(newPassword, salt);

        await db.Usuario.update(
            { senha: hash },
            { where: { email } }
        );

        return { success: true, data: 'Senha alterada com sucesso!' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Registration result
 */
async function registerUser(email, password) {
    try {
        // Validate email format
        if (!email.match(EMAIL_REGEX)) {
            return { success: false, error: 'Email não existe!' };
        }

        // Check if email already exists
        const existingUser = await db.Usuario.findOne({ where: { email } });

        if (existingUser) {
            return { success: false, error: 'Email já cadastrado!' };
        }

        // Validate password format
        if (!password.match(PASSWORD_REGEX)) {
            return {
                success: false,
                error: 'Senha não atende aos requisitos mínimos!',
                requisitos: [
                    'No mínimo 8 caracteres',
                    'Pelo menos uma letra maiúscula',
                    'Pelo menos uma letra minúscula',
                    'Pelo menos um caractere especial',
                    'Sem espaços entre caracteres',
                    'No máximo 24 caracteres'
                ]
            };
        }

        // Hash password and create user
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        const user = await db.Usuario.create({
            email,
            senha: hash
        });

        return {
            success: true,
            data: {
                mensagem: 'Usuário cadastrado!',
                cadastro: user
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = {
    verifyToken,
    loginUser,
    validatePassword,
    changePassword,
    registerUser
};
