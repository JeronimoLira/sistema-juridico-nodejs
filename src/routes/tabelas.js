// 📄 src/routes/tabelas.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tabelaGenericaController = require('../controllers/tabelaGenericaController');

router.use(authMiddleware);

router.post('/tabela', tabelaGenericaController.obterTabela);

module.exports = router;
