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

// 🔄 Sincroniza sessão com token do localStorage após login
router.post('/syncSession', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ mensagem: 'Header de autorização inválido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.session.token = token;
    req.session.usuario = decoded;
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao verificar token para sessão:', err);
    res.status(401).json({ mensagem: 'Token inválido' });
  }
});

module.exports = router;
