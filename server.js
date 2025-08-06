// 📄 server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const msg = require('./src/utils/mensagens');
const pagesProcessosRoutes = require('./src/routes/pagesProcessos');
const tabelasRoutes = require('./src/routes/tabelas');
const carregarMenu = require('./src/middleware/menuMiddleware');

// Menu
app.use(carregarMenu); // Middleware para carregar o menu

// 📦 Carrega variáveis de ambiente
dotenv.config();

// Usando .ejs
app.set('views', path.join(__dirname, 'src', 'views', 'pages'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views/pages'));

// 🛠️ Configurações do Express-Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // se usar HTTPS depois, mude para true
}));

// 🛠️ Middlewares globais0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 🔄 Rotas públicas (SEM middleware!)
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);   // 👈 deve vir ANTES
app.use('/api', tabelasRoutes);     // 👈 este usa middleware global

// 📦 Rotas públicas e protegidas
const publicRoutes = require('./src/routes/publicRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const protegidasRoutes = require('./src/routes/protegidas');
const processosRoutes = require('./src/routes/processos');

// 🟢 Rotas de páginas
app.use('/processos', pagesProcessosRoutes);

// 🟢 Rotas públicas (sem autenticação)
app.use('/', publicRoutes);

// 🟢 Rotas CRUD
//app.use('/clientes', require('./src/routes/clientesCrud'));
//app.use('/processos', require('./src/routes/processosCrud'));

// 🔒 Rotas protegidas por token JWT
app.use('/api/processos', processosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/protegidas', protegidasRoutes);

// 📩 Reset de senha (antes do 404!)
app.get('/resetarSenha/:token', (req, res) => {
  const token = req.params.token;
  res.render('resetar_senha', { token });
});

// ❌ Rota não encontrada
app.use((req, res) => {
  res.status(404).render('erro', {
    codigo: 404,
    mensagem: msg.PAGINA_NAO_ENCONTRADA,
    rotaLogin: '/login' // 🔧 Adicionado
  });
});

// 💥 Erros gerais
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  res.status(500).render('erro', {
    codigo: 500,
    mensagem: msg.ERRO_TENTAR_LOGIN + msg.TENTE_NOVAMENTE,
    rotaLogin: '/login' // 🔧 Adicionado
  });
});

// 🚀 Inicia o servidor
const PORT = process.env.PORT || 3000;
console.log(`🚀 ${msg.SERVIDOR_PORTA} ${PORT}`);
app.listen(PORT);
