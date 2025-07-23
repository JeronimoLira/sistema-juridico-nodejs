// 📄 src/routes/processos.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const processosController = require('../controllers/processosController');
const msg = require('../utils/mensagens');

router.use(authMiddleware, (req, res, next) => {
  if (req.usuario.tipo !== 'interno') {
    return res.status(403).json({ mensagem: msg.ACESSO_RESTRITO_A + ' usuários internos' });
  }
  next();
});

// ✅ rota para listar processos
router.get('/', processosController.listar);

router.get('/:id', processosController.carregarPorId);

module.exports = router;
