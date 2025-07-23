// public/js/login.js
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('msg');

  if (!login || !senha) {
    msg.textContent = 'Login e senha são obrigatórios.';
    msg.classList.add('text-red-600');
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, senha })
    });

    const data = await response.json();

    msg.textContent = data.mensagem;
    msg.classList.remove('text-red-600', 'text-green-600');
    msg.classList.add(res.ok ? 'text-green-600' : 'text-red-600');

    if (data.trocarSenha) {
      // Senha temporária
      localStorage.setItem('token', data.tokenTemporario);
      setTimeout(() => {
        window.location.href = '/trocarSenha';
      }, 1000);
    } else if (res.ok) {
      // Login normal
      localStorage.setItem('token', data.token);
      console.log('Token salvo:', data.token);
      setTimeout(() => {
        window.location.href = '/dashboard_processos';
      }, 1000);
    }
  } catch (err) {
    console.error('Erro no login:', error);
    msg.textContent = 'Erro inesperado. Tente novamente.';
    msg.classList.add('text-red-600');
  }
});
