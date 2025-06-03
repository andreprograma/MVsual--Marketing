// Importa o módulo express para criação de rotas
const express = require('express');
// Importa o módulo de conexão com o banco de dados (db.js)
const db = require('./db');
// Importa a biblioteca XLSX para manipulação de arquivos Excel
const XLSX = require('xlsx');
// Cria um objeto Router para definir rotas específicas
const router = express.Router();

// Define uma rota GET no caminho '/leads' para exportar os leads em formato Excel
router.get('/leads', (req, res) => {
  // Executa uma consulta no banco para buscar nome, email e data de cadastro de todos os leads
  db.all(`SELECT nome, email, dataCadastro FROM leads`, [], (err, rows) => {
    // Se houver erro na consulta, retorna erro 500 com mensagem de erro
    if (err) return res.status(500).json({ erro: 'Erro ao buscar leads' });

    // Converte os dados (array de objetos JSON) retornados do banco em uma planilha Excel
    const worksheet = XLSX.utils.json_to_sheet(rows);
    // Cria um novo arquivo Excel (workbook)
    const workbook = XLSX.utils.book_new();
    // Adiciona a planilha criada ao arquivo Excel, nomeando-a como 'Leads'
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    // Gera um buffer binário com o conteúdo do arquivo Excel no formato .xlsx
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Define o cabeçalho para indicar que o conteúdo é um arquivo para download com o nome 'leads.xlsx'
    res.setHeader('Content-Disposition', 'attachment; filename="leads.xlsx"');
    // Define o tipo MIME correto para arquivos Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // Envia o buffer do arquivo Excel como resposta para o cliente
    res.send(buffer);
  });
});

// Exporta o objeto router para ser usado em outras partes da aplicação
module.exports = router;
