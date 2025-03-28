const express = require('express');
const router = express.Router();
const db = require('../db'); 




router.post('/szures', (req, res) => {
    const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;
  
    
    let sql = 'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1';
    const params = [];
  
    if (vegzettseg) {
      sql += ' AND vegzettseg = ?';
      params.push(vegzettseg);
    }
    if (korcsoport) {
      const [minAge, maxAge] = korcsoport.split('-').map(Number);
      sql += ` AND TIMESTAMPDIFF(YEAR, korcsoport, CURDATE()) BETWEEN ? AND ?`;
      params.push(minAge, maxAge);
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