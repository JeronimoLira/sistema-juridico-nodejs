// src/utils/logger.js
const debugAtivo = process.env.DEBUG === 'true';

exports.log = (contexto, ...mensagens) => {
  if (debugAtivo) {
    console.log(`[DEBUG] [${contexto}]`, ...mensagens);
  }
};

exports.error = (contexto, ...mensagens) => {
  if (debugAtivo) {
    console.error(`[DEBUG] [${contexto}]`, ...mensagens);
  }
};
