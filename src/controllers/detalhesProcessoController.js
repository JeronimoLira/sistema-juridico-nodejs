const pool = require('../../db/db');
const sql = require('../services/sqlQueries');

exports.renderizarDetalhes = async (req, res) => {
  const processoId = req.params.id;

  try {
    const [detalhesRows] = await pool.execute(sql.DETALHES_PROCESSO, [processoId]);
    if (!detalhesRows.length) {
      return res.status(404).render('erro', { codigo: 404, mensagem: 'Processo não encontrado', rotaLogin: '/login' });
    }

    const processo = detalhesRows[0];

    const [movimentosRows] = await pool.execute(sql.MOVIMENTOS_PROCESSO, [processoId]);
    const [extrajudRows] = await pool.execute(sql.EXTRAJUD_PROCESSO, [processoId]);

    res.render('detalhes_processo', {
      processo,
      movimentos: movimentosRows,
      extrajud: extrajudRows
    });

  } catch (err) {
    console.error('Erro ao carregar detalhes do processo:', err);
    res.status(500).render('erro', { codigo: 500, mensagem: 'Erro interno do servidor', rotaLogin: '/login' });
  }
};
