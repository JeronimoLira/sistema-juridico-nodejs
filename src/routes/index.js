// File: src/routes/protectedRoute.js
const express = require('express');
const router = express.Router();
const restrictAccess = require('../middleware/authMiddleware');
const db = require('../../db/db');

router.get('/', restrictAccess, async (req, res) => {
  res.send('Página protegida');
});

module.exports = router;


