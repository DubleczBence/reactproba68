const express = require('express');
const router = express.Router();
const db = require('../db'); // Importáld az adatbázis konfigurációt
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f';

// Regisztrációs végpont
router.post('/home', async (req, res) => {
  const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;

  // Ellenőrzés
  if (!vegzettseg || !korcsoport || !regio || !nem || !anyagi) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

   // Ellenőrzés hogy a dátum valid
   if (!Date.parse(korcsoport)) {
    return res.status(400).json({ error: 'Érvénytelen dátum formátum!' });
  }

  try {

    // JWT token dekódolása
    const token = req.headers.authorization.split(' ')[1]; // Bearer token
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id; // Azonosító a JWT tokenből

    // Adatok beszúrása a users_responses táblába
    await db.promise().query(
      'INSERT INTO users_responses (user_id, korcsoport, vegzettseg, regio, nem, anyagi_helyzet) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, new Date(korcsoport), vegzettseg, regio, nem, anyagi]
    );

    res.status(201).json({ message: 'Küldés sikeres!' });
  } catch (error) {
    console.error('Hiba történt a küldés közben:', error);
    res.status(500).json({ error: 'Hiba történt a küldés során.' });
  }
});



router.get('/check-form-filled', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;

  try {
    const [responses] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );

    if (responses.length > 0) {
      res.status(200).json({ isFormFilled: true });
    } else {
      res.status(200).json({ isFormFilled: false });
    }
  } catch (error) {
    console.error('Hiba történt a kérdőív kitöltésének ellenőrzése közben:', error);
    res.status(500).json({ error: 'Hiba történt a kérdőív kitöltésének ellenőrzése során.' });
  }
});

module.exports = router;