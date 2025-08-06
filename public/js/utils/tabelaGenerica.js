// 📄 public/js/utils/tabelaGenerica.js

export async function carregarTabelaGenerica({
    queryName,
    params = [],
    pagina = 1,
    limite = 10,
    idTabela,
    idPaginacao,
    renderizarLinha
}) {
  const tabela = document.getElementById(idTabela);
  const paginacao = document.getElementById(idPaginacao);
  const token = localStorage.getItem('token');

  pagina = Number(pagina) || 1;
  limite = Number(limite) || 10;

  if (!tabela) {
    console.warn(`⚠️ Tabela com ID "${idTabela}" não encontrada.`);
    return;
  }

  if (!token) {
    console.error('❌ Token JWT ausente. Redirecionando para login.');
    window.location.href = '/login';
    return;
  }

  try {
    const resposta = await fetch(`/api/tabela?queryName=${queryName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ params, pagina, limite })
    });

    if (!resposta.ok) throw new Error('Erro ao buscar dados da tabela');

    const data = await resposta.json();

    if (!data.registros?.length) {
      tabela.innerHTML = `<tr><td colspan="5" class="text-center text-gray-600">Nenhum registro encontrado.</td></tr>`;
      paginacao.innerHTML = '';
      return;
    }

    tabela.innerHTML = data.registros.map(renderizarLinha).join('');

    // Renderização estilizada da paginação com Tailwind
    const totalPaginas = data.paginas || 1;
    paginacao.innerHTML = '';

    const criarBotao = (texto, paginaAlvo, desabilitado = false) => {
      const btn = document.createElement('button');
      btn.textContent = texto;
      btn.className = `mx-1 px-3 py-1 rounded border text-sm font-medium transition-colors duration-200
        ${desabilitado
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white border-gray-300'}`;
      if (!desabilitado) {
        btn.onclick = () => carregarTabelaGenerica({
          queryName,
          params,
          pagina: paginaAlvo,
          limite,
          idTabela,
          idPaginacao,
          renderizarLinha
        });
      }
      return btn;
    };

    // << Primeira página
    paginacao.appendChild(criarBotao('<<', 1, pagina === 1));
    // < Página anterior
    paginacao.appendChild(criarBotao('<', pagina - 1, pagina === 1));

    // Botões numéricos limitados (máx. 5 por vez)
    const range = 2;
    const inicio = Math.max(1, pagina - range);
    const fim = Math.min(totalPaginas, pagina + range);
    for (let i = inicio; i <= fim; i++) {
      const ativo = i === pagina;
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `mx-1 px-3 py-1 rounded text-sm font-medium border ${ativo
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white border-gray-300'}`;
      if (!ativo) {
        btn.onclick = () => carregarTabelaGenerica({
          queryName,
          params,
          pagina: i,
          limite,
          idTabela,
          idPaginacao,
          renderizarLinha
        });
      }
      paginacao.appendChild(btn);
    }

    // > Próxima página
    paginacao.appendChild(criarBotao('>', pagina + 1, pagina === totalPaginas));
    // >> Última página
    paginacao.appendChild(criarBotao('>>', totalPaginas, pagina === totalPaginas));
  } catch (err) {
    console.error('❌ Erro ao carregar tabela genérica:', err);
    tabela.innerHTML = '<tr><td colspan="5" class="text-center text-red-600">Erro ao carregar dados.</td></tr>';
  }
}