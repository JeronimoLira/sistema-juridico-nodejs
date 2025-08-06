// 📄 public/js/dashboardProcessos.js
import { log } from './utils/logger.js';
import { validarToken } from './utils/rotinasGenericas.js';
import { carregarTabelaGenerica } from './utils/tabelaGenerica.js';

window.DEBUG = true;

export async function carregarProcessos(pagina = 1) {
  const numero = document.getElementById('filtroNumero')?.value || '';
  const cliente = document.getElementById('filtroCliente')?.value || '';
  const usuario = document.getElementById('filtroUsuario')?.value || '';

  const params = [numero, cliente, usuario];

  await carregarTabelaGenerica({
    queryName: 'LISTAR_PROCESSOS_PAGINADOS',
    params: [
          numero, numero,     // filtro por número
          cliente, cliente,   // filtro por cliente
          usuario, usuario    // filtro por encarregado
    ],
    pagina,
    limite: 10,
    idTabela: 'tabelaProcessos',
    idPaginacao: 'paginacao',
    renderizarLinha
  });
}

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

  const select = document.getElementById('filtroUsuario');
  if (select) select.value = usuario.codigo;

  await carregarProcessos(1);
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

function renderizarLinha(proc) {
  const desktopRow = `
    <tr class="hidden sm:table-row">
      <td class="p-3 truncate text-gray-100 bg-gray-800 border-b border-gray-700">
        ${proc.numero ? `<a href="/processos/${proc.codigo}" class="text-blue-600 hover:underline">${proc.numero}</a>` : '-'}
      </td>
      <td class="p-3 truncate text-gray-100 bg-gray-800 border-b border-gray-700">
        ${proc.cliente ? `<a href="/clientes/${proc.cliente_id}" class="text-blue-600 hover:underline">${proc.cliente}</a>` : '-'}
      </td>
      <td class="p-3 truncate text-gray-100 bg-gray-800 border-b border-gray-700">${proc.parte_contraria}</td>
      <td class="p-3 text-gray-100 bg-gray-800 border-b border-gray-700">${proc.prazo || '-'}</td>
      <td class="p-3 text-gray-100 bg-gray-800 border-b border-gray-700">${proc.audiencia || '-'}</td>
    </tr>`;

  const mobileRow = `
    <tr class="table-row sm:hidden">
      <td colspan="5" class="p-2">
        <div class="bg-white dark:bg-gray-800 rounded shadow p-3 mb-2">
          <div class="mb-1"><span class="font-semibold text-gray-700 dark:text-gray-300">Número:</span> 
            ${proc.numero ? `<a href="/processos/${proc.codigo}" class="text-blue-600 hover:underline">${proc.numero}</a>` : '-'}
          </div>
          <div class="mb-1"><span class="font-semibold text-gray-700 dark:text-gray-300">Cliente:</span> 
            ${proc.cliente ? `<a href="/clientes/${proc.cliente_id}" class="text-blue-600 hover:underline">${proc.cliente}</a>` : '-'}
          </div>
          <div class="mb-1"><span class="font-semibold text-gray-700 dark:text-gray-300">Parte Contrária:</span> ${proc.parte_contraria || '-'}</div>
          <div class="mb-1"><span class="font-semibold text-gray-700 dark:text-gray-300">Prazo:</span> ${proc.prazo || '-'}</div>
          <div><span class="font-semibold text-gray-700 dark:text-gray-300">Audiência:</span> ${proc.audiencia || '-'}</div>
        </div>
      </td>
    </tr>`;

  return desktopRow + mobileRow;
}
