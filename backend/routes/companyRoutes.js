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
    const companyId = decoded.id;

    await db.promise().query(
      'UPDATE companies SET credits = credits - ? WHERE id = ?',
      [creditCost, companyId]
    );

    const [surveyResult] = await db.promise().query(
      `INSERT INTO survey_set (
        title, mintavetel, 
        vegzettseg, korcsoport, regio, nem, anyagi, credit_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, participantCount,
        filterCriteria.vegzettseg || null,
        filterCriteria.korcsoport || null,
        filterCriteria.regio || null,
        filterCriteria.nem || null,
        filterCriteria.anyagi || null,
        creditCost
      ]
    );

    const surveyId = surveyResult.insertId;
    
    // Kapcsolat létrehozása a company_connections táblában
    await db.promise().query(
      'INSERT INTO company_connections (company_id, connection_type, connection_id) VALUES (?, "survey", ?)',
      [companyId, surveyId]
    );

    // Kérdések létrehozása és kapcsolatok létrehozása a survey_connections táblában
    for (const question of questions) {
      const [questionResult] = await db.promise().query(
        'INSERT INTO questions (question, frm_option, type) VALUES (?, ?, ?)',
        [question.questionText, JSON.stringify(question.options), question.selectedButton]
      );
      
      // Kapcsolat létrehozása a survey_connections táblában
      await db.promise().query(
        'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "question", ?)',
        [surveyId, questionResult.insertId]
      );
    }

    // Kredit tranzakció létrehozása
    const [transactionResult] = await db.promise().query(
      'INSERT INTO credit_transactions (amount, transaction_type) VALUES (?, "spend")',
      [creditCost]
    );
    
    // Kapcsolat létrehozása a company_connections táblában
    await db.promise().query(
      'INSERT INTO company_connections (company_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [companyId, transactionResult.insertId]
    );
    
    // Kapcsolat létrehozása a survey_connections táblában
    await db.promise().query(
      'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [surveyId, transactionResult.insertId]
    );

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



router.get('/credits/:companyId', async (req, res) => {
  try {
    const [company] = await db.promise().query(
      'SELECT credits FROM companies WHERE id = ?',
      [req.params.companyId]
    );
    
    res.json({ credits: company[0].credits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});



router.post('/purchase-credits', async (req, res) => {
  const { packageAmount, companyId } = req.body;
  console.log("Received request:", { packageAmount, companyId });
  
  try {
    const [transactionResult] = await db.promise().query(
      'INSERT INTO credit_transactions (amount, transaction_type) VALUES (?, "purchase")',
      [packageAmount]
    );
    
    // Kapcsolat létrehozása a company_connections táblában
    await db.promise().query(
      'INSERT INTO company_connections (company_id, connection_type, connection_id) VALUES (?, "transaction", ?)',
      [companyId, transactionResult.insertId]
    );

    await db.promise().query(
      'UPDATE companies SET credits = credits + ? WHERE id = ?',
      [packageAmount, companyId]
    );
    
    const [company] = await db.promise().query(
      'SELECT credits FROM companies WHERE id = ?',
      [companyId]
    );
    
    console.log("Updated credits:", company[0].credits);
    res.status(200).json({ 
      message: 'Credits purchased successfully',
      currentCredits: company[0].credits 
    });
  } catch (error) {
    console.error("Error in purchase-credits:", error);
    res.status(500).json({ error: 'Failed to purchase credits' });
  }
});


router.get('/credit-history/:companyId', async (req, res) => {
  try {
    const [transactions] = await db.promise().query(
      `SELECT 
        ct.*,
        DATE_FORMAT(ct.created_at, '%Y-%m-%d %H:%i') as formatted_date
       FROM credit_transactions ct
       JOIN company_connections cc ON ct.id = cc.connection_id
       WHERE cc.company_id = ? AND cc.connection_type = 'transaction'
       ORDER BY ct.created_at DESC`,
      [req.params.companyId]
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit history' });
  }
});



router.get('/survey-answers/:surveyId', async (req, res) => {
  try {
    const [questions] = await db.promise().query(
      `SELECT q.id, q.question, q.frm_option, q.type,
        COUNT(DISTINCT uc.user_id) as total_responses
       FROM questions q
       JOIN survey_connections sc ON q.id = sc.connection_id AND sc.connection_type = 'question'
       LEFT JOIN answers a ON q.id = a.question_id
       LEFT JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE sc.survey_id = ?
       GROUP BY q.id`,
      [req.params.surveyId]
    );

    const surveyAnswers = await Promise.all(questions.map(async (question) => {
      if (question.type === 'text') {
        const [textAnswers] = await db.promise().query(
          `SELECT a.answer 
           FROM answers a
           JOIN user_connections uc ON a.id = uc.connection_id
           WHERE uc.connection_type = 'answer' AND a.question_id = ?`,
          [question.id]
        );
        return {
          questionText: question.question,
          type: question.type,
          answers: textAnswers.map(a => ({
            option: JSON.parse(a.answer)
          }))
        };
      }

      const options = JSON.parse(question.frm_option);
      const [answerCounts] = await db.promise().query(
        `SELECT a.answer, COUNT(*) as count
         FROM answers a
         JOIN user_connections uc ON a.id = uc.connection_id
         WHERE uc.connection_type = 'answer' AND a.question_id = ?
         GROUP BY a.answer`,
        [question.id]
      );

      const answers = options.map(option => {
        const answerCount = answerCounts.reduce((count, a) => {
          const parsedAnswer = JSON.parse(a.answer);
          if (Array.isArray(parsedAnswer)) {
            return parsedAnswer.includes(option.label) ? count + a.count : count;
          } else {
            return parsedAnswer === option.label ? count + a.count : count;
          }
        }, 0);

        return {
          option: option.label,
          count: answerCount,
          percentage: Math.round((answerCount / question.total_responses) * 100) || 0
        };
      });

      return {
        questionText: question.question,
        type: question.type,
        answers: answers
      };
    }));

    res.json(surveyAnswers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch survey answers' });
  }
});


module.exports = router;