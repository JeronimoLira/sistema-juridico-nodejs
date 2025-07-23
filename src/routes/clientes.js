// src/routes/clientes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const clientesController = require('../controllers/clientesController');
const msg = require('../utils/mensagens');

router.get('/:id', clientesController.carregarPorId);

module.exports = router;
