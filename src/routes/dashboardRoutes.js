// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const dashboardController = require('../controllers/dashboardController');
const msg = require('../utils/mensagens');

// Rota protegida para dados do dashboard
router.get('/acessos-diarios', dashboardController.acessosDiarios);

module.exports = router;
