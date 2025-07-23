// 📄 src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ✅ Garantia: carrega o arquivo correto
const authMiddleware = require('../middleware/authMiddleware');

// 🔷 Login
router.post('/login', authController.login);

// 🔷 Troca de senha (precisa estar autenticado)
router.post('/trocarSenha', authMiddleware, authController.trocarSenha);

// 🔷 Solicitação de redefinição
router.post('/esqueciSenha', authController.esqueciSenha);

// 🔷 Envio do novo password
router.post('/resetarSenha/:token', authController.resetarSenha);

module.exports = router;
