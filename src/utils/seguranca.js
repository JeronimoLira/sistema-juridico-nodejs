// File: src/utils/seguranca.js
const bcrypt = require('bcrypt');

/**
 * Verifica se a senha digitada é a senha temporária gerada.
 * @param {string} login - Login do usuário
 * @param {string} hashSalva - Hash salvo no banco
 * @returns {Promise<boolean>} - True se for a senha temporária
 */
async function verificarSenhaTemporaria(login, hashsalva) {
  const senhaTemporaria = `${login}2025`;
  return bcrypt.compare(senhaTemporaria, hashsalva);
}

module.exports = { 
  verificarSenhaTemporaria 
};
