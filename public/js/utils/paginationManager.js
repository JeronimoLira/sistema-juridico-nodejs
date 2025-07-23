export class PaginationManager {
  constructor(idTabela) {
    this.idTabela = idTabela;
    this.estado = {
      paginaAtual: 1,
      loginFiltro: null,
      totalPaginas: 1
    };
  }

  setEstado(paginaAtual, loginFiltro, totalPaginas) {
    this.estado.paginaAtual = paginaAtual;
    this.estado.loginFiltro = loginFiltro;
    this.estado.totalPaginas = totalPaginas;
  }

  render(totalPaginas, callback, desativado = false) {
    const container = document.getElementById(`paginacao_${this.idTabela}`);
    container.innerHTML = '';

    this.estado.totalPaginas = totalPaginas;

    const criarBotao = (label, pagina, isDisabled = false) => {
      const isAtivo = (pagina === this.estado.paginaAtual && !isDisabled && !isNaN(pagina));

      const baseClasses = [
        'px-3', 'py-1', 'rounded', 'border', 'border-gray-300',
        'transition-colors', 'mx-0.5',
        isAtivo
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white'
      ];

      if (desativado || isDisabled) {
        baseClasses.push('opacity-50', 'cursor-not-allowed');
      }

      const botao = document.createElement('button');
      botao.textContent = label;
      botao.className = baseClasses.join(' ');

      botao.addEventListener('click', (e) => {
        e.preventDefault();
        callback(pagina);
      });

      container.appendChild(botao);
    };

    // Botão << para primeira página
    criarBotao('<<', 1, this.estado.paginaAtual === 1);

    // Botão < para anterior
    criarBotao('<', this.estado.paginaAtual - 1, this.estado.paginaAtual === 1);

    // Botões numerados
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      criarBotao(pagina, pagina);
    }

    // Botão > para próxima
    criarBotao('>', this.estado.paginaAtual + 1, this.estado.paginaAtual === totalPaginas);

    // Botão >> para última página
    criarBotao('>>', totalPaginas, this.estado.paginaAtual === totalPaginas);
  }
}
