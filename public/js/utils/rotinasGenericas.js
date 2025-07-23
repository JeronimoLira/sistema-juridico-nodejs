// 📄 public/js/utils/rotinasGenericas.js

export function formatarData(dataIso) {
  if (!dataIso) return '-';
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

/**
 * Valida o token do usuário no backend para garantir que ainda está válido.
 * Caso inválido, limpa o localStorage e redireciona para erro 403.
 */
export async function validarToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = `/erro/403`;
    return false;
  }

  try {
    const resposta = await fetch('/api/protegidas/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) throw new Error('Token inválido');

    const dados = await resposta.json();
    return dados.usuario;
  } catch (erro) {
    console.error('Erro ao validar token:', erro);
    localStorage.removeItem('token');
    window.location.href = '/erro/403';
    return false;
  }
}
