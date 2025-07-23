// routes/protegidas.js
const express = require('express');
const router = express.Router();
const pool    = require('../../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const processosController = require('../controllers/processosController');

// ✅ Aplica o middleware para todas as rotas a partir daqui
router.use(authMiddleware);

// Listar processos paginados
router.get('/', processosController.listar);

// Rota protegida de exemplo
router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({
    mensagem: 'Acesso autorizado à área restrita',
    usuario: req.usuario,
  });
});
0
// Lista usuários internos ativos
// router.get('/usuarios-internos', usuariosController.listarInternos);

// Rota que retorna lista de usuários internos ativos
router.get('/usuarios-internos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT codigo, login, nome FROM usuarios WHERE ativo = 1 ORDER BY nome'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar usuários internos:', err);
    res.status(500).json({ mensagem: 'Erro ao carregar usuários internos.' });
  }
});

module.exports = router;
