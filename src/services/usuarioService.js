// File: src/services/usuarioService.js
const pool = require('../../db/db');
const SQL = require('./sqlQueries');
const bcrypt = require('bcrypt');

/**
 * Atualiza a senha de um usuário pelo código
 * @param {number} codigo
 * @param {string} novaSenha
 */
async function atualizarSenhaPorCodigo(codigo, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await pool.query(SQL.ATUALIZAR_SENHA_POR_CODIGO, [senhaHash, codigo]);
}

/**
 * Atualiza a senha de um usuário pelo login
 * @param {string} login
 * @param {string} novaSenha  
 */
async function atualizarSenhaPorLogin(login, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 10); 
  await pool.query(SQL.ATUALIZAR_SENHA_POR_LOGIN, [senhaHash, login]);
} 

/**
 * Atualiza a senha de um usuário_externo pelo login
 * @param {string} login
 * @param {string} novaSenha  
 */
async function atualizarSenhaExternoPorLogin(login, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await pool.query(SQL.ATUALIZAR_SENHA_EXTERNO_POR_LOGIN, [senhaHash, login]);
}

/**
 * Atualiza a senha de um usuário_externo pelo codigo
 * @param {number} codigo
 * @param {string} novaSenha  
 */
async function atualizarSenhaExternoPorCodigo(codigo, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await pool.query(SQL.ATUALIZAR_SENHA_EXTERNO_POR_CODIGO, [senhaHash, codigo]);
}

/**
 * Busca um usuário no banco pelo login
 * @param {string} login
 * @returns {Promise<object|null>}
 */
async function buscarUsuarioPorLogin(login) {
  const [usuarios] = await pool.query(SQL.BUSCAR_USUARIO_POR_LOGIN, [login]);
  return usuarios[0] || null;
}

/**
 * Busca um usuário_externo no banco pelo login
 * @param {string} login
 * @returns {Promise<object|null>}
 */
async function buscarUsuarioExternoPorLogin(login) {
  const [usuarios] = await pool.query(SQL.BUSCAR_USUARIO_EXTERNO_POR_LOGIN, [login]);
  return usuarios[0] || null;
}

/**
 * Monta o objeto usuario a partir do payload JWT
 * @param {object} decoded
 * @returns {object}
 */
function montarUsuario(decoded) {
  return {
    login: decoded.login,
    nome: decoded.nome || null,
    email: decoded.email,
    nivel: decoded.nivel,
    tipo: decoded.tipo,
    codigo: decoded.codigo,
    cliente_id: decoded.cliente_id || null
  };
}

module.exports = {
  atualizarSenhaPorCodigo,
  atualizarSenhaPorLogin,
  atualizarSenhaExternoPorLogin,
  atualizarSenhaExternoPorCodigo,
  buscarUsuarioPorLogin,
  buscarUsuarioExternoPorLogin,
  montarUsuario
};
