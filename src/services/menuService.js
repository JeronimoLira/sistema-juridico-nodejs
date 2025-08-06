// 📁 src/services/menuService.js
const pool = require('../../db/db');

exports.obterMenu = async () => {
  const [rows] = await pool.query(`
    SELECT * FROM tab_menu WHERE ativo = 1 ORDER BY nivel, codigo_pai, ordem
  `);
  return rows;
};
