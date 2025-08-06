// src/middleware/menuMiddleware.js
const pool = require('../../db/db');
const sql = require('../services/sqlQueries');

async function carregarMenu(req, res, next) {
    try {
        const [menu] = await pool.query(sql.MONTAR_MENU);
        res.locals.menu = menu;
    } catch (err) {
        console.error('Erro ao carregar menu:', err);
        res.locals.menu = []; // Garante que não quebre
    }
    next();
}

module.exports = carregarMenu;
