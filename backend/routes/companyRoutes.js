const express = require('express');
const router = express.Router();
const db = require('../db'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'surv3yapp@gmail.com',
    pass: 'zpbw fkod fubk unli'
  }
});

const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f';

// Céges regisztrációs végpont
router.post('/sign-up', async (req, res) => {
  const { cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam } = req.body;

  
  if (!cegnev || !telefon || !ceg_email || !jelszo || !telepules || !megye || !ceges_szamla || !hitelkartya || !adoszam || !cegjegyzek || !helyrajziszam) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    
    const [existingCompany] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ?',
      [ceg_email]
    );
    if (existingCompany.length > 0) {
      return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
    }

    
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

    
    const isPasswordValid = await bcrypt.compare(jelszo, company.jelszo);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    // JWT token generálása
    const token = jwt.sign(
      { id: company.id, ceg_email: company.ceg_email },
      SECRET_KEY,
      { expiresIn: '1h' } 
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
  const { title, questions, participantCount, filterCriteria, creditCost } = req.body;
  console.log("Received request body:", req.body);
  console.log("Filter criteria:", req.body.filterCriteria);
  try {

    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, SECRET_KEY);
    const cegId = decoded.id;


    const [surveyResult] = await db.promise().query(
      `INSERT INTO survey_set (
        title, ceg_id, mintavetel, 
        vegzettseg, korcsoport, regio, nem, anyagi, credit_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, cegId, participantCount,
        filterCriteria.vegzettseg || null,
        filterCriteria.korcsoport || null,
        filterCriteria.regio || null,
        filterCriteria.nem || null,
        filterCriteria.anyagi || null,
        creditCost
      ]
    );

    const surveyId = surveyResult.insertId;

  
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


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const securityCode = Math.floor(10000 + Math.random() * 90000).toString();

  try {
    const [companies] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ?',
      [email]
    );

    if (companies.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await db.promise().query(
      'UPDATE companies SET reset_code = ?, reset_code_expires = ? WHERE ceg_email = ?',
      [securityCode, new Date(Date.now() + 3600000), email]
    );

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      text: `Your security code is: ${securityCode}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Security code sent successfully' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

router.post('/verify-reset-code', async (req, res) => {
  const { ceg_email, code, newPassword } = req.body;

  try {
    const [company] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ? AND reset_code = ? AND reset_code_expires > NOW()',
      [ceg_email, code]
    );

    if (company.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query(
      'UPDATE companies SET jelszo = ?, reset_code = NULL, reset_code_expires = NULL WHERE ceg_email = ?',
      [hashedPassword, ceg_email]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});


module.exports = router;