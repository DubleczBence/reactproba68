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

    // Admin ellenőrzés
    const isAdmin = user.role === 'admin';
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role || 'user' 
    }, SECRET_KEY, {
      expiresIn: '1h', 
    });

    res.status(200).json({ 
      message: 'Bejelentkezés sikeres!', 
      token, 
      name: user.name, 
      id: user.id,
      isAdmin: isAdmin
    });
  } catch (error) {
    console.error('Hiba történt a bejelentkezés során:', error);
    res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
  }
});


router.get('/check-admin', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (decoded.role === 'admin') {
      return res.status(200).json({ isAdmin: true });
    }
    
    return res.status(403).json({ isAdmin: false, message: 'Nincs admin jogosultság' });
  } catch (error) {
    return res.status(401).json({ error: 'Érvénytelen token' });
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
    const [result] = await db.promise().query(
      'SELECT credits FROM users WHERE id = ?',
      [req.params.userId]
    );
    res.json({ credits: result[0].credits });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching credits' });
  }
});

router.get('/credit-history/:userId', async (req, res) => {
  try {
    const [transactions] = await db.promise().query(
      `SELECT t.* FROM transactions t
       JOIN user_connections uc ON t.id = uc.connection_id 
       WHERE uc.user_id = ? AND uc.connection_type = 'transaction'
       ORDER BY t.transaction_date DESC`,
      [req.params.userId]
    );
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching credit history:', error);
    res.status(500).json({ error: 'Error fetching credit history' });
  }
});

router.post('/purchase-voucher', async (req, res) => {
  const { userId, voucherName, creditCost } = req.body;
  
  try {
    await db.promise().query('START TRANSACTION');

    const [user] = await db.promise().query(
      'SELECT credits FROM users WHERE id = ?',
      [userId]
    );

    if (!user.length || user[0].credits < creditCost) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    await db.promise().query(
      'UPDATE users SET credits = credits - ? WHERE id = ?',
      [creditCost, userId]
    );

    const [voucherResult] = await db.promise().query(
      'INSERT INTO vouchers (user_id, name, credit_cost, purchase_date) VALUES (?, ?, ?, NOW())',
      [userId, voucherName, creditCost]
    );

    // Add to user_connections table
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "voucher", ?)',
      [userId, voucherResult.insertId]
    );

    const [transactionResult] = await db.promise().query(
      `INSERT INTO transactions 
       (user_id, amount, transaction_type, transaction_date, voucher_name) 
       VALUES (?, ?, 'purchase', NOW(), ?)`,
      [userId, creditCost, voucherName]
    );

    // Add transaction to user_connections
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [userId, transactionResult.insertId]
    );

    await db.promise().query('COMMIT');

    res.json({
      message: 'Voucher purchased successfully',
      currentCredits: user[0].credits - creditCost
    });
  } catch (error) {
    await db.promise().query('ROLLBACK');
    res.status(500).json({ error: 'Failed to purchase voucher' });
  }
});


router.post('/add-survey-transaction', async (req, res) => {
  const { userId, amount, title, surveyId } = req.body; // Hozzáadtuk a surveyId-t
  
  console.log('Received transaction data:', { userId, amount, title, surveyId });

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    // Tranzakció kezdése
    await db.promise().query('START TRANSACTION');
    
    // Tranzakció létrehozása
    const [transactionResult] = await db.promise().query(
      `INSERT INTO transactions 
       (user_id, amount, transaction_type, transaction_date, voucher_name) 
       VALUES (?, ?, 'survey', NOW(), ?)`,
      [userId, amount, title]
    );
    
    // Kapcsolat létrehozása a user_connections táblában
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [userId, transactionResult.insertId]
    );
    
    // Ha van surveyId, akkor kapcsolat létrehozása a survey_connections táblában is
    if (surveyId) {
      await db.promise().query(
        'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
        [surveyId, transactionResult.insertId]
      );
    }
    
    // Tranzakció véglegesítése
    await db.promise().query('COMMIT');
    
    res.json({ message: 'Survey transaction recorded successfully' });
  } catch (error) {
    // Hiba esetén visszagörgetés
    await db.promise().query('ROLLBACK');
    console.error('Error recording survey transaction:', error);
    res.status(500).json({ error: 'Failed to record survey transaction' });
  }
});

module.exports = router;