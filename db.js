// Importa o SQLite e módulo path para resolver caminhos de arquivos
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define o caminho absoluto para o arquivo leads.sqlite
const dbPath = path.resolve(__dirname, 'leads.sqlite');

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log('🟢 Conectado ao SQLite com sucesso');
  }
});

// Cria a tabela "leads" se ela ainda não existir
// created_at armazena a data e hora em que o lead foi cadastrado
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;

