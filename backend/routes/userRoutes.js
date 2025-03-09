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

// Regisztrációs végpont
router.post('/sign-up', async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
    
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
    }

    
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

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
    }

    
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h', 
    });

    res.status(200).json({ message: 'Bejelentkezés sikeres!', token, name: user.name, id: user.id });
  } catch (error) {
    console.error('Hiba történt a bejelentkezés során:', error);
    res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
  }
});


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const securityCode = Math.floor(10000 + Math.random() * 90000).toString();

  try {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await db.promise().query(
      'UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE email = ?',
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
  const { email, code, newPassword } = req.body;

  try {
    const [user] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
      [email, code]
    );

    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query(
      'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});


router.get('/credits/:userId', async (req, res) => {
  try {
    const [user] = await db.promise().query(
      'SELECT credits FROM users WHERE id = ?',
      [req.params.userId]
    );
    res.json({ credits: user[0].credits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});



router.get('/transaction-history/:userId', async (req, res) => {
  try {
    const [transactions] = await db.promise().query(
      `SELECT 
        uvt.*,
        v.name as voucher_name,
        DATE_FORMAT(uvt.created_at, '%Y-%m-%d %H:%i') as formatted_date
       FROM user_voucher_transactions uvt
       LEFT JOIN vouchers v ON uvt.voucher_id = v.id
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.params.userId]
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

router.post('/purchase-voucher', async (req, res) => {
  const { userId, voucherId, creditCost } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO user_voucher_transactions (user_id, voucher_id, amount, transaction_type) VALUES (?, ?, ?, "purchase")',
      [userId, voucherId, creditCost]
    );

    await db.promise().query(
      'UPDATE users SET credits = credits - ? WHERE id = ?',
      [creditCost, userId]
    );

    const [user] = await db.promise().query(
      'SELECT credits FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Voucher purchased successfully',
      currentCredits: user[0].credits
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to purchase voucher' });
  }
});

module.exports = router;