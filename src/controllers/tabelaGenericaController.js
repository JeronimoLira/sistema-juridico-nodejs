// 📄 src/controllers/tabelaGenericaController.js
const pool = require('../../db/db');
const sql = require('../services/sqlQueries');
const msg = require('../utils/mensagens');

exports.obterTabela = async (req, res) => {
  const { queryName } = req.query;
  const pagina = parseInt(req.body.pagina, 10) || 1;
  const limite = parseInt(req.body.limite, 10) || 10;
  const offset = (pagina - 1) * limite;

  console.log('🟡 pagina:', pagina, 'limite:', limite, 'offset:', offset);

  if (!sql[queryName]) {
    return res.status(400).json({ mensagem: msg.QUERY_INVALIDA });
  }

  const params = Array.isArray(req.body.params) ? req.body.params : [];

  try {
    // Conta total
    const countSql = `SELECT COUNT(*) as total FROM (${sql[queryName]}) AS sub`;

    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0].total;
    const paginas = Math.ceil(total / limite);

    // Dados paginados
    const paginatedSql = `${sql[queryName]} LIMIT ? OFFSET ?`;

    console.log('📦 Params recebidos:', params);
    console.log('📥 Query:', paginatedSql);
    console.log('📊 Final Params para SQL:', [...params, limite, offset]);

    const [rows] = await pool.query(paginatedSql, [...params, limite, offset]);

    res.json({ registros: rows, pagina, paginas, total });
  } catch (err) {
    console.error('Erro ao carregar tabela genérica:', err);
    res.status(500).json({ mensagem: msg.ERRO_INTERNO_SERVIDOR });
  }
};
