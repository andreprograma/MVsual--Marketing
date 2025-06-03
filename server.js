// Importa os módulos principais
const express = require('express');                     // Framework web para criar servidor HTTP
const session = require('express-session');             // 🟡 Middleware para controle de sessão do usuário
const cors = require('cors');                           // Permite requisições de diferentes origens (Cross-Origin)
const bodyParser = require('body-parser');              // Analisa o corpo das requisições (formulários/JSON)
const path = require('path');                           // Manipula caminhos de arquivos
const db = require('./db');                             // Conecta ao banco SQLite (definido em db.js)
const registerRoute = require('./register');            // Importa as rotas de cadastro

// Inicializa o app e define a porta
const app = express();
const PORT = 3001;                                      // Porta do backend (API)

// Middleware: CORS e JSON
app.use(cors());                                        // Permite o frontend acessar este backend (por exemplo, via fetch)
app.use(bodyParser.json());                             // Aceita requisições com JSON
app.use(bodyParser.urlencoded({ extended: true }));     // Aceita dados de formulários também

// Servir arquivos do frontend (ex: admin.html, login.html)
app.use(express.static(path.join(__dirname, '../')));   // Permite servir os arquivos HTML, CSS, JS do frontend

// 🔐 Middleware de proteção (só acessa admin.html se logado)
app.use('/pages/admin.html', (req, res, next) => {
  if (req.session.user) {                               // Se o usuário está logado (sessão existe)
    next();                                              // ✅ Deixa passar para a página
  } else {
    res.redirect('/pages/login.html');                  // ❌ Redireciona para login
  }
});

// POST /api/login – autentica e cria sessão
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;                    // Pega email e senha do corpo da requisição

  const sql = 'SELECT * FROM admin WHERE email = ? AND senha = ?';  // Consulta o admin
  db.get(sql, [email, senha], (err, row) => {
    if (err) {
      console.error('Erro no login:', err.message);     // Se erro no banco
      return res.status(500).send('Erro interno');
    }

    if (row) {
      req.session.user = email;                         // ✅ Se achou o admin, cria sessão
      res.redirect('/pages/admin.html');                // Redireciona para página protegida
    } else {
      res.send(`<script>alert("Login inválido."); window.location.href = "/pages/login.html";</script>`); // Mensagem de erro via JavaScropt
    }
  });
});

// Importa rota de métricas
const metricsRoute = require('./metrics');              // Rota para consultar métricas (ex: conversões, tráfego)
app.use('/api/metrics', metricsRoute);                  // Usa a rota com o prefixo /api/metrics

// Rota de exportação de dados em XLSX
const exportRoute = require('./export');                // Rota que permite exportar leads para Excel
app.use('/api/export', exportRoute);                    // Usa com o prefixo /api/export

// GET /logout – encerra a sessão
app.get('/logout', (req, res) => {
  req.session.destroy(() => {                           // Destrói a sessão ativa
    res.redirect('/pages/login.html');                  // Redireciona de volta para login
  });
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`); // Mensagem quando servidor está pronto
});

