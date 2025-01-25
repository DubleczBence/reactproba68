const express = require('express');
const router = express.Router();
const db = require('../db'); // Importáld az adatbázis konfigurációt




// Szűrési adatok fogadása és lekérdezés futtatása
router.post('/szures', (req, res) => {
    const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;
  
    // Dinamikus SQL feltétel generálása
    let sql = 'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1';
    const params = [];
  
    if (vegzettseg) {
      sql += ' AND vegzettseg = ?';
      params.push(vegzettseg);
    }
    if (korcsoport) {
      sql += ' AND korcsoport = ?';
      params.push(korcsoport);
    }
    if (regio) {
      sql += ' AND regio = ?';
      params.push(regio);
    }
    if (nem) {
      sql += ' AND nem = ?';
      params.push(nem);
    }
    if (anyagi) {
      sql += ' AND anyagi_helyzet = ?';
      params.push(anyagi);
    }
  
    // Lekérdezés végrehajtása
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Hiba történt az adatbázis lekérdezése közben');
      } else {
        res.json({ count: results[0].count });
      }
    });
  });


  module.exports = router;