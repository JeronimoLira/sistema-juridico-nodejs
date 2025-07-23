// 📄 src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { montarUsuario } = require('../services/usuarioService');

const authMiddleware = (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.session?.token) {
    token = req.session.token;
  }

  if (!token) {
    if (req.path.endsWith('.ico') || req.path.endsWith('.png') || req.path.endsWith('.jpg')) {
      return res.sendStatus(204);
    }
    console.log('❌ Authorization token ausente');
    return res.status(401).redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = montarUsuario(decoded);
    next();
  } catch (error) {
    console.error('❌ Erro ao verificar token JWT:', error);
    return res.status(401).redirect('/login');
  }
};

module.exports = authMiddleware;
