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

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  try {
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
  const { userId, amount, title, surveyId } = req.body;
  
  console.log('Received transaction data:', { userId, amount, title, surveyId });

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    await db.promise().query('START TRANSACTION');
    
    const [transactionResult] = await db.promise().query(
      `INSERT INTO transactions 
       (user_id, amount, transaction_type, transaction_date, voucher_name) 
       VALUES (?, ?, 'survey', NOW(), ?)`,
      [userId, amount, title]
    );
    
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [userId, transactionResult.insertId]
    );
    
    if (surveyId) {
      await db.promise().query(
        'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
        [surveyId, transactionResult.insertId]
      );
    }
    
    await db.promise().query('COMMIT');
    
    res.json({ message: 'Survey transaction recorded successfully' });
  } catch (error) {
    await db.promise().query('ROLLBACK');
    console.error('Error recording survey transaction:', error);
    res.status(500).json({ error: 'Failed to record survey transaction' });
  }
});


router.get('/profile/:userId', async (req, res) => {
  try {
    const [user] = await db.promise().query(
      `SELECT u.id, u.name, u.email, 
       DATE_FORMAT(ur.korcsoport, '%Y-%m-%d') as korcsoport,
       ur.vegzettseg, ur.regio, ur.nem, ur.anyagi_helyzet as anyagi
       FROM users u
       LEFT JOIN users_responses ur ON u.id = ur.user_id
       WHERE u.id = ?`,
      [req.params.userId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

router.put('/profile/:userId', async (req, res) => {
  const { name, regio, anyagi } = req.body;
  const userId = req.params.userId;
  
  try {
    await db.promise().query('START TRANSACTION');
    
    if (name !== undefined) {
      await db.promise().query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, userId]
      );
    }
    
    const [existingResponse] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );
    
    if (existingResponse.length > 0) {
      const updates = [];
      const params = [];
      
      if (regio !== undefined) {
        updates.push('regio = ?');
        params.push(regio);
      }
      
      if (anyagi !== undefined) {
        updates.push('anyagi_helyzet = ?');
        params.push(anyagi);
      }
      
      if (updates.length > 0) {
        params.push(userId);
        await db.promise().query(
          `UPDATE users_responses SET ${updates.join(', ')} WHERE user_id = ?`,
          params
        );
      }
    } else if (regio !== undefined || anyagi !== undefined) {
      await db.promise().query(
        `INSERT INTO users_responses (user_id, korcsoport, vegzettseg, regio, nem, anyagi_helyzet)
         VALUES (?, CURDATE(), '5', ?, '20', ?)`,
        [userId, regio || '14', anyagi || '23']
      );
    }
    
    await db.promise().query('COMMIT');
    
    const [updatedUser] = await db.promise().query(
      `SELECT u.name, ur.regio, ur.anyagi_helyzet as anyagi
       FROM users u
       LEFT JOIN users_responses ur ON u.id = ur.user_id
       WHERE u.id = ?`,
      [userId]
    );
    
    res.json({ 
      message: 'User profile updated successfully',
      updatedData: updatedUser[0] || { name, regio, anyagi }
    });
  } catch (error) {
    await db.promise().query('ROLLBACK');
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

module.exports = router;