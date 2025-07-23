// 📄 public/js/dashboardProcessos.js

import { validarToken, formatarData } from './utils/rotinasGenericas.js';
import { PaginationManager } from './utils/paginationManager.js';
import { LoadingManager } from './utils/loadingManager.js';
import { inicializarTabela } from './utils/tabelaGenerica.js';

const loadingManager = new LoadingManager();
const paginacaoProcessos = new PaginationManager('processos');
const estadoPaginacaoProcessos = {
  paginaAtual: 1,
  loginFiltro: null
};

async function preencherCabecalhoComUsuario() {
  const usuario = await validarToken();
  if (usuario) {
    const el = document.getElementById('nomeUsuario');
    if (el) {
      const nomeOuEmail = usuario.nome || usuario.email || usuario.login;
      el.textContent = `Usuário: ${nomeOuEmail}`;
    }
  }
}

(async () => {
  const usuario = await validarToken();
  if (!usuario) return;

  await preencherCabecalhoComUsuario();
  await carregarUsuariosInternos?.();

  const select = document.getElementById('filtroUsuario');
  if (select) select.value = usuario.codigo;

  const token = localStorage.getItem('token');
  console.log('Token enviado para API:', token);
  
  if (token) {
    inicializarTabela('#tabelaProcessos', {
      endpoint: '/api/processos',
      metodo: 'GET',
      colunas: ['numero', 'cliente', 'parte_contraria', 'prazo', 'audiencia'],
      links: ['numero', 'cliente'],
      titulo: 'Lista de Processos',
      token // ✅ agora passamos o token para a função
    });
  }
})();

export function exportarParaExcel() {
  const tabelaProcessos = document.getElementById('tabelaProcessos');
  const linhas = Array.from(tabelaProcessos.querySelectorAll('tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
  );

  const cabecalho = ['Número', 'Cliente', 'Parte Contrária', 'Prazo', 'Audiência'];
  const planilha = [cabecalho, ...linhas];
  const worksheet = XLSX.utils.aoa_to_sheet(planilha);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Processos');
  XLSX.writeFile(workbook, 'processos.xlsx');
}
