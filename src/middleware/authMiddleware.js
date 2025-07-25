// 📄 src/middleware/authMiddleware.js
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const { montarUsuario } = require('../services/usuarioService');

module.exports = (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.session?.token) {
    token = req.session.token;
  }

  if (!token) {
    if (req.path.endsWith('.ico') || req.path.endsWith('.png') || req.path.endsWith('.jpg')) {
      return res.sendStatus(204);
    }
    console.log('❌ Authorization token ausente');
    return res.status(401).redirect('/login');
  }

  logger.log('authMiddleware', 'headers.authorization:', req.headers.authorization);
  logger.log('authMiddleware', 'session.token:', req.session?.token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = montarUsuario(decoded);
    next();
  } catch (err) {
    console.error('❌ Erro ao verificar token JWT:', err);
    return res.status(401).redirect('/login');
  }
};