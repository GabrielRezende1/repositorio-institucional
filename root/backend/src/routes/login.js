const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

/**
 * /login - Verify token, authenticate user, change password
 * /cadastro - Register new user
 * /logout - Logout user
 */

// GET /login - Verify token validity
router.get('/login', loginController.getLogin);

// POST /login - Authenticate user
router.post('/login', loginController.postLogin);

// PUT /login - Change password
router.put('/login', loginController.putLogin);

// POST /cadastro - Register new user
router.post('/cadastro', loginController.postRegister);

// DELETE /logout - Logout user
router.delete('/logout', loginController.deleteLogout);

module.exports = router;
