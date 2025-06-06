const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar novo lead
router.post('/', (req, res) => {
  const { nome, email, mensagem } = req.body;

  db.run(
    'INSERT INTO leads (nome, email, mensagem) VALUES (?, ?, ?)',
    [nome, email, mensagem],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Contagem total de leads
router.get('/count', (req, res) => {
  db.get('SELECT COUNT(*) as total FROM leads', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: row.total });
  });
});

// Filtragem por data
router.get('/filter', (req, res) => {
  const { dia, mes, ano } = req.query;

  let query = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
  const params = [];

  if (ano) {
    query += ' AND strftime("%Y", data_envio) = ?';
    params.push(ano);
  }

  if (mes) {
    query += ' AND strftime("%m", data_envio) = ?';
    params.push(mes.padStart(2, '0'));
  }

  if (dia) {
    query += ' AND strftime("%d", data_envio) = ?';
    params.push(dia.padStart(2, '0'));
  }

  db.get(query, params, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: row.total });
  });
});

module.exports = router;
