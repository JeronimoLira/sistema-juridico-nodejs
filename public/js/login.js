console.log('🚀 Script de login carregado');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  const msg = document.getElementById('mensagem');

  if (!form) {
    console.warn('⚠️ Formulário #formLogin não encontrado!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    console.log('🧪 Submit capturado');
    e.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, senha }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'FetchRequest',
        },
      });

      if (!resposta.ok) throw new Error('Erro no login');

      const contentType = resposta.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const html = await resposta.text();
        console.warn('⚠️ Resposta HTML recebida:', html);
        throw new Error('Resposta não-JSON');
      }

      const data = await resposta.json();
      msg.textContent = data.mensagem || '';
      msg.className = resposta.ok ? 'text-green-600' : 'text-red-600';

      if (data.token) {
        localStorage.setItem('token', data.token);

        await fetch('/api/auth/syncSession', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${data.token}`,
            'x-requested-with': 'fetchrequest',
          },
        });

        window.location.href = data.trocarSenha
          ? '/trocarSenha'
          : '/dashboard_processos';
      }
    } catch (err) {
      console.error('❌ Erro no processamento do login:', err);
      msg.textContent = 'Erro ao processar resposta do servidor.';
      msg.className = 'text-red-600';
    }
  });
});
