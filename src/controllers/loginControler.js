// src/controllers/loginController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../../db/db');
const msg = require('../utils/mensagens');
const usuarioService = require('../services/usuarioService');

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  try {
    // 1. Verifica se é um usuario interno
    const usuarios = await usuarioService.buscarUsuarioPorLogin(login);
    let tipo = 'interno';

    if (usuarios.length === 0) {
      // 2. Se não for interno, tenta buscar como usuario externo
      const usuarios = await usuarioService.buscarUsuarioExternoPorLogin(login);
      let tipo = 'externo';
    }

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: msg.LOGIN_SENHA_INVALIDOS });
    }

    const usuario = usuarios[0];
    const senhaValida = senha === usuario.senha || await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: msg.LOGIN_SENHA_INVALIDOS });
    }

    console.log('🔍 usuario retornado do banco:', usuario);
    
    const token = jwt.sign({
      codigo: usuario.codigo,
      login: usuario.login,
      nome: usuario.nome,
      email: usuario.email,
      nivel: usuario.nivel,
      tipo: tipo
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ mensagem: msg.ERRO_TENTAR_LOGIN + ' ' + msg.LOGIN_NOVAMENTE });
  }
};
