// Importa o módulo express para criar rotas e o módulo de conexão com o banco de dados
const express = require('express');
// Cria um objeto Router para definir rotas separadas da aplicação principal
const router = express.Router();
// Importa a configuração/conexão com o banco de dados (arquivo db.js)
const db = require('./db');

// Define uma rota POST no caminho '/' para cadastrar um novo lead
router.post('/', (req, res) => {
  // Extrai os campos 'nome' e 'email' enviados no corpo da requisição
  const { nome, email } = req.body;

  // Validação simples para garantir que nome e email foram informados
  if (!nome || !email) {
    // Retorna erro 400 (requisição inválida) com mensagem informando que os campos são obrigatórios
    return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
  }

  // Query SQL para inserir os dados na tabela 'leads' usando parâmetros para evitar SQL Injection
  const query = `INSERT INTO leads (nome, email) VALUES (?, ?)`;

  // Executa a query de inserção no banco de dados, passando os valores de nome e email
  db.run(query, [nome, email], function(err) {
    // Caso haja erro na inserção, loga no console e retorna erro 500 (erro interno do servidor)
    if (err) {
      console.error('❌ Erro ao cadastrar:', err.message);
      return res.status(500).json({ erro: 'Erro ao cadastrar lead.' });
    }

    // Se a inserção for bem sucedida, retorna status 201 (criado) e o ID do novo lead inserido
    res.status(201).json({
      mensagem: 'Lead cadastrado com sucesso!',
      id: this.lastID  // 'this.lastID' é o ID gerado pela inserção no banco
    });
  });
});

// Exporta o objeto router para que possa ser utilizado em outros arquivos da aplicação
module.exports = router;
