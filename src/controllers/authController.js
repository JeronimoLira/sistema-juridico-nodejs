// 📄 src/controllers/authController.js
const logger = require('../utils/logger');
const msg = require('../utils/mensagens');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioService = require('../services/usuarioService');
const { enviarEmailResetSenha } = require('../utils/email');
const { verificarSenhaTemporaria } = require('../utils/seguranca');
require('dotenv').config();

const gerarToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  logger.log('authController', 'POST /api/auth/login body:', req.body);

  if (!login || !senha) {
    return res.status(400).json({ mensagem: msg.LOGIN_SENHA_OBRIGATORIOS });
  }

  try {
    let usuario = await usuarioService.buscarUsuarioPorLogin(login);
    let tipo = 'interno';

    if (!usuario) {
      usuario = await usuarioService.buscarUsuarioExternoPorLogin(login);
      tipo = 'externo';
      if (usuario && !usuario.cliente_id) {
        return res.status(403).json({
          mensagem:
            'Usuário externo sem cliente associado. Contate o administrador.',
        });
      }
    }

    if (!usuario)
      return res.status(401).json({ mensagem: msg.USUARIO_NAO_ENCONTRADO });
    if (!usuario.ativo)
      return res.status(403).json({ mensagem: msg.USUARIO_INATIVO });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      return res.status(401).json({ mensagem: msg.SENHA_INVALIDA });

    const ehTemporaria = await verificarSenhaTemporaria(login, usuario.senha);

    const tokenPayload = {
      codigo: usuario.codigo,
      login: usuario.login,
      nome: usuario.nome,
      email: usuario.email,
      nivel: usuario.nivel,
      tipo,
      ...(tipo === 'externo' ? { cliente_id: usuario.cliente_id } : {}),
    };

    const token = gerarToken(tokenPayload);
    logger.log('authController', 'Token gerado:', token);
    req.session.token = token;
    req.session.usuario = tokenPayload;

    const isJson = req.headers.accept?.includes('application/json');
    const isFetch =
      req.headers['x-requested-with']?.toLowerCase() === 'fetchrequest';

    console.log('💬 Headers:', req.headers);
    console.log('🎯 isJson:', isJson, '| isFetch:', isFetch);

    if (!isJson && !isFetch) {
      return res.redirect('/dashboard_processos');
    }

    console.log('🧾 Conteúdo da resposta JSON:', data);

    if (data.token) {
      localStorage.setItem('token', data.token);
      // ...
    }

    if (ehTemporaria) return res.status(200).json({ token, trocarSenha: true });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    return res
      .status(500)
      .json({ mensagem: msg.ERRO_TENTAR_LOGIN + msg.TENTE_NOVAMENTE });
  }
};

// 📩 Enviar e-mail com link para redefinir senha
exports.esqueciSenha = async (req, res) => {
  const sql = require('../services/sqlQueries');
  const { login } = req.body;

  if (!login) {
    return res.status(400).json({ mensagem: msg.LOGIN_OBRIGATORIO });
  }

  try {
    const [usuarios] = await pool.query(sql.BUSCAR_USUARIO_POR_LOGIN, [login]);

    if (!usuarios.length) {
      return res.status(404).json({ mensagem: msg.USUARIO_NAO_ENCONTRADO });
    }

    const usuario = usuarios[0];
    const token = jwt.sign(
      { codigo: usuario.codigo, login: usuario.login },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await enviarEmailResetSenha(usuario.email, token);

    return res.status(200).json({ mensagem: msg.LINK_REDEFINICAO_ENVIADO });
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição:', error);
    return res.status(500).json({ mensagem: msg.ERRO_ENVIAR_EMAIL });
  }
};

// 🔒 Trocar a senha após o primeiro acesso
exports.trocarSenha = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { novaSenha } = req.body;

  if (!authHeader || !novaSenha) {
    return res.status(400).json({ mensagem: msg.TOKEN_NOVA_SENHA_AUSENTE });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tipo === 'interno') {
      await usuarioService.atualizarSenhaPorCodigo(decoded.codigo, novaSenha);
    } else {
      await usuarioService.atualizarSenhaExternoPorCodigo(
        decoded.codigo,
        novaSenha
      );
    }

    return res.status(200).json({ mensagem: msg.SENHA_ALTERADA_SUCESSO });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    return res.status(500).json({ mensagem: msg.ERRO_TROCAR_SENHA });
  }
};

// ♻️ Redefinir senha com token enviado por e-mail
exports.resetarSenha = async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ mensagem: msg.TOKEN_NOVA_SENHA_AUSENTE });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await usuarioService.atualizarSenhaPorLogin(decoded.login, novaSenha);

    return res.status(200).json({ mensagem: msg.SENHA_REDEFINIDA_SUCESSO });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ mensagem: msg.ERRO_REDEFINIR_SENHA });
  }
};
