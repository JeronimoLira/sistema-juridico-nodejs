// 📄 src/routes/publicRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const msg = require('../utils/mensagens');

// Renderiza a página inicial
router.get('/', (req, res) => {
  res.render('login');
});

// Tela de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Painel de processos 
router.get('/dashboard_processos', (req, res) => {
  res.render('dashboard_processos');
});

// Tela de logout
router.get('/logout', (req, res) => {
  res.render('logout');
});

// Tela de redefinição de senha com token (link por e-mail)
router.get('/resetarSenha/:token', (req, res) => {
  const { token } = req.params;
  res.render('resetar_senha', { token });
});

// Tela de solicitação de redefinição de senha
router.get('/esqueci-senha', (req, res) => {
  res.render('esqueci_senha');
});

// Página de sucesso após troca de senha
router.get('/sucesso-troca', (req, res) => {
  res.render('sucesso-troca');
});

// Página de troca de senha obrigatória (senha temporária)
router.get('/trocarSenha', (req, res) => {
  res.render('trocar_senha', { /* context */ });
});

// Rota com código de erro específico
router.get('/erro/:codigo', (req, res) => {
  const codigo = parseInt(req.params.codigo);

  const mensagens = {
    403: msg.ACESSO_NEGADO,
    404: msg.PAGINA_NAO_ENCONTRADA,
    500: msg.ERRO_INESPERADO
  };

  res.status(codigo).render('erro', {
    codigo,
    mensagem: mensagens[codigo] || msg.ERRO_DESCONHECIDO,
    rotaLogin: '/login'
  });
});

module.exports = router;
