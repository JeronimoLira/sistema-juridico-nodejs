// File: src/controllers/processosController.js
const pool = require('../../db/db');
const jwt = require('jsonwebtoken');
const processosService = require('../services/processosService');

require('dotenv').config();

exports.listar = async (req, res) => {
  const { numero, cliente, loginFiltro, pagina = 1, limite = 10 } = req.query;
  const offset = (pagina - 1) * limite;
  const usuarioId = req.usuario.codigo;
  const tipo = req.usuario.tipo;
  const clienteId = req.usuario.cliente_id;

  const filtros = {
    numero,
    cliente,
    loginFiltro,
    usuarioId,
    clienteId,
    tipo
  };

  try {
    const processos = await processosService.listarProcessos(filtros, limite, offset);
    const total = await processosService.contarProcessos(filtros);

    const paginas = Math.ceil(total / limite);

    // 👇 Faz o mapeamento para devolver cliente_id no JSON
    const processosFormatados = processos.map(p => ({
      codigo: p.codigo,
      numero: p.numero,
      cliente: p.cliente,
      cliente_id: p.cliente_id,
      parte_contraria: p.parte_contraria,
      prazo: p.prazo,
      audiencia: p.audiencia
    }));

    res.json({ processos: processosFormatados, pagina, paginas, total });
  } catch (err) {
    console.error('Erro ao listar processos:', err);
    res.status(500).json({ mensagem: 'Erro ao listar processos.' });
  }
};

exports.carregarPorId = async (req, res) => {
  const { id } = req.params;
  res.render('pages/processo_form', { id });
};
