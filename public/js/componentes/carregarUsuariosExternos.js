async function carregarUsuariosExternos(selectId = 'filtroUsuario') {
  const token = localStorage.getItem('token');
  const select = document.getElementById(selectId);
  if (!select || !token) return;

  let codigoUsuario = null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    codigoUsuario = payload.codigo;
  } catch (e) {
    console.error('Erro ao decodificar token JWT:', e);
    return;
  }

  try {
    const resposta = await fetch('/api/protegidas/usuarios-externos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) throw new Error('Erro ao carregar usuários externos');

    const usuarios = await resposta.json();

    // Limpa e adiciona opções padrão
    select.innerHTML = `
      <option value="${codigoUsuario}">Meus</option>
      <option value="Todos">Todos</option>
    `;

    usuarios.forEach(u => {
      const option = document.createElement('option');
      option.value = u.codigo;
      option.textContent = u.nome;
      select.appendChild(option);
    });

  } catch (err) {
    console.error('Erro ao carregar usuários externos:', err);
  }
}
