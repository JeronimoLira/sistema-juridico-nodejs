// routes/dashboard.js

// [Arquivo: routes/dashboard.js]
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota protegida que retorna dados de acessos para o dashboard
router.get('/acessos', authMiddleware, dashboardController.listarAcessos);

module.exports = router;
