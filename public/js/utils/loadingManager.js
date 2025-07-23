export class LoadingManager {
  constructor() {
    this.loaders = new Map();
  }

  show(id, targetElement, mensagem = 'Carregando...') {
    if (!targetElement) return;

    targetElement.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          <div class="flex justify-center items-center gap-2 text-gray-600">
            <svg class="w-5 h-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>${mensagem}</span>
          </div>
        </td>
      </tr>`;

    this.loaders.set(id, targetElement);
  }

  hide(id) {
    const targetElement = this.loaders.get(id);
    if (!targetElement) return;

    targetElement.innerHTML = '';
    this.loaders.delete(id);
  }

  hideAll() {
    for (const [id, el] of this.loaders) {
      el.innerHTML = '';
    }
    this.loaders.clear();
  }
}
