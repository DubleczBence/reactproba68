const express = require('express');
const router = express.Router();
const db = require('../db'); // Importáld az adatbázis konfigurációt
const bcrypt = require('bcrypt'); // Jelszó hash-eléshez

// Regisztrációs végpont
router.post('/home', async (req, res) => {
    const { vegzettseg, korcsoport, regio, nem, anyagi, } = req.body;
  
    // Ellenőrzés
    if (!vegzettseg || !korcsoport || !regio || !nem || !anyagi) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }
  
    try {
      // Felhasználó hozzáadása az adatbázishoz
      await db.promise().query(
        'INSERT INTO users (korcsoport, vegzettseg, regio, nem, anyagi_helyzet) VALUES (?, ?, ?, ?, ?)',
        [korcsoport, vegzettseg, regio, nem, anyagi]
      );
  
      res.status(201).json({ message: 'Küldés sikeres!' });
    } catch (error) {
      console.error('Hiba történt regisztráció közben:', error);
      res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
    }
  });

module.exports = router;