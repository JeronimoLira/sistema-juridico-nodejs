const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const detalhesProcessoController = require('../controllers/detalhesProcessoController');

router.use(authMiddleware);

router.get('/:id', detalhesProcessoController.renderizarDetalhes);

module.exports = router;
