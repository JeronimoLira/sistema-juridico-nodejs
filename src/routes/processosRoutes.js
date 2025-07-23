// Arquivo: src/routes/processosRoutes.js
// Rota protegida para listagem de processos com filtros

const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const jwt = require('jsonwebtoken');
const processosController = require('../controllers/processosController');
const autenticar = require('../middlewares/autenticar');

// Middleware para autenticação via JWT
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.sendStatus(403);
    req.usuario = usuario;
    next();
  });
};

// GET /api/processos
router.get('/', autenticarToken, async (req, res) => {
  const { login, nivel } = req.usuario;
  const { cliente, numero, parte, prazo_de, prazo_ate, audiencia_de, audiencia_ate } = req.query;

  try {
    let sql = `
      SELECT 
        p.codigo, p.numero, c.nome AS cliente, p.reu_nome AS parte_contraria,
        p.prazo, p.audiencia,
        TO_DAYS(p.prazo) - TO_DAYS(NOW()) AS dias_prazo,
        TO_DAYS(p.audiencia) - TO_DAYS(NOW()) AS dias_audiencia
      FROM processos p
      JOIN clientes c ON c.codigo = p.cliente_cod
      WHERE p.fechado = 0
    `;

    const filtros = [];

    if (nivel !== 1) {
      sql += ' AND p.encarregado = ?';
      filtros.push(login);
    }
    if (cliente) {
      sql += ' AND c.nome LIKE ?';
      filtros.push(`%${cliente}%`);
    }
    if (numero) {
      sql += ' AND p.numero LIKE ?';
      filtros.push(`%${numero}%`);
    }
    if (parte) {
      sql += ' AND p.reu_nome LIKE ?';
      filtros.push(`%${parte}%`);
    }
    if (prazo_de) {
      sql += ' AND p.prazo >= ?';
      filtros.push(prazo_de);
    }
    if (prazo_ate) {
      sql += ' AND p.prazo <= ?';
      filtros.push(prazo_ate);
    }
    if (audiencia_de) {
      sql += ' AND p.audiencia >= ?';
      filtros.push(audiencia_de);
    }
    if (audiencia_ate) {
      sql += ' AND p.audiencia <= ?';
      filtros.push(audiencia_ate);
    }

    sql += ' ORDER BY c.nome ASC';

    const [rows] = await pool.query(sql, filtros);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar processos:', err);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});


// Rota protegida para listar processos com filtros
router.get('/processos', autenticar, processosController.listarProcessos);


module.exports = router;
