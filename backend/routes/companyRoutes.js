const express = require('express');
const router = express.Router();
const db = require('../db'); // Importáld az adatbázis konfigurációt
const bcrypt = require('bcrypt'); // Jelszó hash-eléshez
const jwt = require('jsonwebtoken'); // JWT token generáláshoz

const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f'; // Ezt cseréld le egy biztonságos kulcsra!

// Céges regisztrációs végpont
router.post('/sign-up', async (req, res) => {
  const { cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam } = req.body;

  // Ellenőrzés
  if (!cegnev || !telefon || !ceg_email || !jelszo || !telepules || !megye || !ceges_szamla || !hitelkartya || !adoszam || !cegjegyzek || !helyrajziszam) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    // Ellenőrizd, hogy az email már létezik-e
    const [existingCompany] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ?',
      [ceg_email]
    );
    if (existingCompany.length > 0) {
      return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
    }

    // Jelszó hash-elése
    const hashedPassword = await bcrypt.hash(jelszo, 10);

    // Céges felhasználó hozzáadása az adatbázishoz
    await db.promise().query(
      'INSERT INTO companies (cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cegnev, telefon, ceg_email, hashedPassword, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam]
    );

    res.status(201).json({ message: 'Céges regisztráció sikeres!' });
  } catch (error) {
    console.error('Hiba történt regisztráció közben:', error);
    res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
  }
});

// Céges bejelentkezési végpont
router.post('/sign-in', async (req, res) => {
  const { ceg_email, jelszo } = req.body;

  // Ellenőrzés
  if (!ceg_email || !jelszo) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    // Céges felhasználó lekérdezése
    const [companies] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ?',
      [ceg_email]
    );

    if (companies.length === 0) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    const company = companies[0];

    // Jelszó ellenőrzése
    const isPasswordValid = await bcrypt.compare(jelszo, company.jelszo);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    // JWT token generálása
    const token = jwt.sign(
      { id: company.id, ceg_email: company.ceg_email },
      SECRET_KEY,
      { expiresIn: '1h' } // Token lejárati idő
    );

    res.status(200).json({
      message: 'Bejelentkezés sikeres!',
      token,
      cegnev: company.cegnev,
      cegId: company.id
    });
  } catch (error) {
    console.error('Hiba történt a bejelentkezés során:', error);
    res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
  }
});


router.post('/create-survey', async (req, res) => {
  const { title, questions } = req.body;

  try {
    // JWT token dekódolása
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, SECRET_KEY);
    const cegId = decoded.id; // Company ID from JWT token



    // Insert into survey_set
    const [surveyResult] = await db.promise().query(
      'INSERT INTO survey_set (title, ceg_id) VALUES (?, ?)',
      [title, cegId]
    );

    const surveyId = surveyResult.insertId;

    // Insert questions and options
    for (const question of questions) {
      const [questionResult] = await db.promise().query(
        'INSERT INTO questions (question, frm_option, type, survey_id) VALUES (?, ?, ?, ?)',
        [question.questionText, JSON.stringify(question.options), question.selectedButton, surveyId]
      );
    }

    res.status(201).json({ message: 'Survey created successfully' });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});


module.exports = router;