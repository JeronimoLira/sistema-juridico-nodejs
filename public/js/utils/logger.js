// public/js/utils/logger.js
export function log(contexto, ...mensagens) {
  if (window.DEBUG) {
    console.log(`[DEBUG] [${contexto}]`, ...mensagens);
  }
}
