const express = require('express');
const router = express.Router();
const db = require('../db'); // Importáld az adatbázis konfigurációt
const bcrypt = require('bcrypt'); // Jelszó hash-eléshez
const jwt = require('jsonwebtoken'); // JWT token generáláshoz

const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f'; // Ezt cseréld le egy biztonságos kulcsra!

// Regisztrációs végpont
router.post('/sign-up', async (req, res) => {
  const { name, email, password } = req.body;

  // Ellenőrzés
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    // Ellenőrizd, hogy az email már létezik-e
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
    }

    // Jelszó hash-elése
    const hashedPassword = await bcrypt.hash(password, 10);

    // Felhasználó hozzáadása az adatbázishoz
    await db.promise().query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Regisztráció sikeres!' });
  } catch (error) {
    console.error('Hiba történt regisztráció közben:', error);
    res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
  }
});

// Bejelentkezési végpont
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  // Ellenőrzés
  if (!email || !password) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    // Felhasználó lekérdezése
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    const user = users[0];

    // Jelszó ellenőrzése
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    // JWT token generálása
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h', // Token lejárati idő
    });

    res.status(200).json({ message: 'Bejelentkezés sikeres!', token, name: user.name });
  } catch (error) {
    console.error('Hiba történt a bejelentkezés során:', error);
    res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
  }
});

module.exports = router;