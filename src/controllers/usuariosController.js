// 📄 src/controllers/usuariosController.js
const pool = require('../../db/db');

exports.listarInternos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT codigo, nome FROM usuarios WHERE ativo = 1 ORDER BY nome'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar usuários internos:', err);
    res.status(500).json({ mensagem: 'Erro ao carregar usuários internos.' });
  }
};
