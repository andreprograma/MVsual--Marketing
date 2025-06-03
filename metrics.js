// Importa módulos necessários
const express = require('express');
const db = require('./db'); // conexão com SQLite
const router = express.Router();

// Utilitário para formatar datas (opcional)
const format = require('date-fns/format');

// Rota GET /api/metrics
router.get('/', (req, res) => {
  const metrics = {};

  // Total de leads
  db.get(`SELECT COUNT(*) as total FROM leads`, [], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao contar total de leads' });
    }
    metrics.totalLeads = row.total;

    // Leads por dia (últimos 7 dias)
    db.all(`
      SELECT DATE(dataCadastro) as dia, COUNT(*) as total
      FROM leads
      GROUP BY dia
      ORDER BY dia DESC
      LIMIT 7
    `, [], (err, rowsDia) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao agrupar por dia' });
      }
      metrics.porDia = rowsDia.reverse(); // ordem cronológica

      // Leads por mês
      db.all(`
        SELECT strftime('%Y-%m', dataCadastro) as mes, COUNT(*) as total
        FROM leads
        GROUP BY mes
        ORDER BY mes DESC
        LIMIT 6
      `, [], (err, rowsMes) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao agrupar por mês' });
        }
        metrics.porMes = rowsMes.reverse();

        // Leads por ano
        db.all(`
          SELECT strftime('%Y', dataCadastro) as ano, COUNT(*) as total
          FROM leads
          GROUP BY ano
          ORDER BY ano DESC
        `, [], (err, rowsAno) => {
          if (err) {
            return res.status(500).json({ erro: 'Erro ao agrupar por ano' });
          }
          metrics.porAno = rowsAno.reverse();

          // Envia tudo junto
          res.json(metrics);
        });
      });
    });
  });
});

module.exports = router;
