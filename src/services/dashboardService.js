// File: src/services/clientesService.js
const pool = require('../../db/db');
const SQL = require('./sqlQueries');

/**
 * Buscar os acessos realizados para dashboard
 */
async function listarAcessos({ dataInicio, dataFim, login, nivel }) {
  let query = SQL.LISTAR_ACESSOS_BASE;
  const params = [];

  if (dataInicio && dataFim) {
    query += ` AND DATE(data_hora) BETWEEN ? AND ?`;
    params.push(dataInicio, dataFim);
  }

  if (login) {
    query += ` AND login LIKE ?`;
    params.push(`%${login}%`);
  }

  if (nivel) {
    query += ` AND nivel = ?`;
    params.push(nivel);
  }

  query += ` ORDER BY data_hora DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
}

async function listarAcessosPorData() {
  const [rows] = await pool.query(sql.LISTAR_ACESSOS_POR_DATA);
  return rows;
}

async function listarAcessosPorDia() {
  const [rows] = await pool.query(sql.LISTAR_ACESSOS_POR_DIA);
  return rows;
}

async function graficoAcessosRecentes() {
  const [rows] = await pool.query(sql.GRAFICO_ACESSOS_RECENTES);
  return rows;
}

async function graficoAcessosUltimos30() {
  const [rows] = await pool.query(sql.GRAFICO_ACESSOS_ULTIMOS_30);
  return rows;
}

module.exports = {
  listarAcessos,
  graficoAcessosRecentes,
  graficoAcessosUltimos30
};