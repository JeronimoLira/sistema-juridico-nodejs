// 📄 public/js/utils/tabelaGenerica.js

export async function inicializarTabela(seletor, options) {
  const {
    endpoint,
    metodo = 'GET',
    colunas = [],
    links = [],
    titulo = ''
  } = options;

  const tabela = document.querySelector(seletor);
  if (!tabela) {
    console.error(`❌ Tabela não encontrada para seletor: ${seletor}`);
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ Token JWT não encontrado no localStorage. Faça login novamente.');
    return;
  }

  try {
    const resposta = await fetch(endpoint, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const data = await resposta.json();

    if (!data.processos || data.processos.length === 0) {
      tabela.innerHTML = `<tr><td colspan="${colunas.length}" class="text-center text-gray-600">Nenhum dado encontrado.</td></tr>`;
      return;
    }

    tabela.innerHTML = '';

    data.processos.forEach(proc => {
      const desktopRow = document.createElement('tr');
      desktopRow.className = 'hidden sm:table-row border-t text-gray-900 dark:text-gray-100';

      const mobileRow = document.createElement('tr');
      mobileRow.className = 'table-row sm:hidden border-t text-gray-900 dark:text-gray-100';
      const mobileTd = document.createElement('td');
      mobileTd.colSpan = colunas.length;
      const mobileDiv = document.createElement('div');
      mobileDiv.className = 'bg-white dark:bg-gray-800 rounded shadow p-3 mb-2';

      colunas.forEach(campo => {
        const valor = proc[campo] || '-';
        const link = links.includes(campo);

        const td = document.createElement('td');
        td.className = 'p-2 bg-white dark:bg-gray-800';

        const display = link
          ? `<a href="/${campo === 'cliente' ? 'clientes' : 'processos'}/${proc[campo + '_id'] || proc.codigo}" class="text-blue-600 hover:underline">${valor}</a>`
          : valor;

        td.innerHTML = display;
        desktopRow.appendChild(td);

        const div = document.createElement('div');
        div.innerHTML = `<span class="font-semibold">${campo.charAt(0).toUpperCase() + campo.slice(1)}:</span> ${display}`;
        mobileDiv.appendChild(div);
      });

      mobileTd.appendChild(mobileDiv);
      mobileRow.appendChild(mobileTd);

      tabela.appendChild(desktopRow);
      tabela.appendChild(mobileRow);
    });

  } catch (err) {
    console.error('Erro ao inicializar tabela:', err);
    tabela.innerHTML = `<tr><td colspan="${colunas.length}" class="text-center text-red-600">Erro ao carregar dados.</td></tr>`;
  }
}
