// File: src/utils/atualizarSenhas.js
const pool = require('../../db/db');
const bcrypt = require('bcrypt');

async function atualizarSenhas() {
  try {
    //const [usuarios] = await pool.query('SELECT login FROM usuarios WHERE ativo = 1');
    const [usuarios] = await pool.query('SELECT login FROM usuarios_externos WHERE ativo = 1');

    for (const usuario of usuarios) {
      const senhaTemporaria = `${usuario.login}2025`;
      // const senhaTemporaria = `jlira2025`;
      const senhaHash = await bcrypt.hash(senhaTemporaria, 10);
      await pool.query('UPDATE usuarios_externos SET senha = ? WHERE login = ?', [senhaHash, usuario.login]);
      console.log(`Senha atualizada para: ${usuario.login}`);
    }

    console.log('Todas as senhas foram atualizadas com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao atualizar senhas:', err);
    process.exit(1);
  }
}

atualizarSenhas();
