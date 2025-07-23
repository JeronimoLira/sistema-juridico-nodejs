// File: controllers/dashboardController.js

const msg = require('../utils/mensagens');
const dashboardService = require('../services/dashboardService');

exports.getAcessos = async (req, res) => {
  try {
    const { dataInicio, dataFim, login, nivel } = req.query;

    const rows = await dashboardService.listarAcessos({ dataInicio, dataFim, login, nivel });

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao obter acessos:', error);
    res.status(500).json({ mensagem: msg.ERRO_OBTER_DADOS + ' de acessos.' });
  }};

exports.listarAcessosPorData = async (req, res) => {
  try {
    const rows = await dashboardService.listarAcessosPorData();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar acessos:', error);
    res.status(500).json({ mensagem: msg.ERRO_BUSCAR_DADOS + ' de acessos.' });
  }
};

// Controlador para a rota /acessos-diarios
exports.acessosDiarios = async (req, res) => {
  try {
    const rows = await dashboardService.listarAcessosPorDia();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar acessos:', error);
    res.status(500).json({ mensagem: msg.ERRO_BUSCAR_DADOS + ' de acessos.'});
  }
};
