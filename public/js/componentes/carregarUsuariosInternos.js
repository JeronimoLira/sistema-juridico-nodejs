// 📄 public/js/componentes/carregarUsuariosInternos.js
async function carregarUsuariosInternos(selectId = 'filtroUsuario') {
  const token = localStorage.getItem('token');
  const select = document.getElementById(selectId);
  if (!select || !token) return;

  // Decodifica o payload do JWT para obter o código do usuário logado
  let usuarioId;
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(token.split('.')[1]));
    usuarioId = payload.codigo; // Assumindo que o código do usuário está no payload
  } catch (e) {
    console.error('Erro ao decodificar token JWT:', e);
    return;
  }

  try {
    const resposta = await fetch('/api/protegidas/usuarios-internos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) throw new Error('Erro ao carregar usuários internos');

    const usuarios = await resposta.json();

    // 1) Limpa e adiciona os dois defaults
    select.innerHTML = `
      <option value="${usuarioId}">Meus</option>
      <option value="Todos">Todos</option>
    `;

    // 2) Agora, para cada usuário ativo, cria uma <option>
    usuarios.forEach(u => {
      const option = document.createElement('option');
      option.value = u.codigo;      // EXATAMENTE o código numérico
      option.textContent = u.nome;  // exibe o nome do advogado

      // Se este for o próprio usuário logado, já deixamos selecionado
      if (u.codigo === usuarioId) {
        option.selected = true;
      }

      select.appendChild(option);
    });

  } catch (err) {
    console.error('Erro ao carregar usuários internos:', err);
  } 
}
