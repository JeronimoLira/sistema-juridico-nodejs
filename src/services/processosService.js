// src/services/processosService.js
const pool = require('../../db/db');
const sql = require('./sqlQueries');

/**
 * Monta a cláusula WHERE e os parâmetros para a consulta de processos.
 *
 * @param {Object} filtros
 * @param {string} [filtros.numero]
 * @param {string} [filtros.cliente]
 * @param {string|number} [filtros.loginFiltro]
 * @param {number} filtros.usuarioId
 * @param {number} [filtros.clienteId]
 * @param {string} filtros.tipo - "interno" ou "externo"
 * @returns {{whereClause: string, params: Array}}
 */
function montarFiltros({ numero, cliente, loginFiltro, usuarioId, clienteId, tipo }) {
  let whereClause = 'WHERE p.fechado = 0';
  const params = [];

  if (tipo === 'externo') {
    if (clienteId) {
      whereClause += ' AND c.codigo = ?';
      params.push(clienteId);
    } else {
      throw new Error('Usuário externo não está associado a um cliente.');
    }
  } else {
    if (loginFiltro != 0 && loginFiltro !== 'Todos') {
      const codigo = parseInt(loginFiltro, 10);
      if (!isNaN(codigo)) {
        whereClause += ' AND p.encarregado = ?';
        params.push(codigo);
      } else {
        whereClause += ' AND p.encarregado = ?';
        params.push(usuarioId);
      }
    }
  }

  if (numero) {
    whereClause += ' AND p.numero LIKE ?';
    params.push(`%${numero}%`);
  }

  if (cliente) {
    whereClause += ' AND c.nome LIKE ?';
    params.push(`%${cliente}%`);
  }

  return { whereClause, params };
}

/**
 * Busca a lista de processos paginada.
 *
 * @async
 * @param {Object} filtros
 * @param {number} limite
 * @param {number} offset
 * @returns {Promise<Array>}
 */
async function listarProcessos(filtros, limite = 10, offset = 0) {
  const { whereClause, params } = montarFiltros(filtros);

  // aqui pega o tipo corretamente do objeto filtros
  const tipo = filtros.tipo;

  let query = sql.LISTAR_PROCESSOS_PAGINADOS;

  query += `
    ${whereClause}
    ORDER BY c.nome ASC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [...params, parseInt(limite), parseInt(offset)];

  const [processos] = await pool.query(query, queryParams);

  return processos;
}

/**
 * Conta o total de processos para os filtros informados.
 *
 * @async
 * @param {Object} filtros
 * @returns {Promise<number>}
 */
async function contarProcessos(filtros) {
  const { whereClause, params } = montarFiltros(filtros);

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM processos p
    JOIN clientes c ON c.codigo = p.cliente_cod
    ${whereClause}
  `;

  const [countResult] = await pool.query(countQuery, params);

  return countResult[0]?.total || 0;
}

module.exports = {
  listarProcessos,
  contarProcessos
};
