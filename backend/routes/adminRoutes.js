const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f';

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin jogosultság szükséges' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Érvénytelen token' });
  }
};

// Felhasználók listázása
router.get('/users', isAdmin, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email, credits, role FROM users'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a felhasználók lekérdezése során' });
  }
});

// Cégek listázása
router.get('/companies', isAdmin, async (req, res) => {
  try {
    const [companies] = await db.promise().query(
      'SELECT id, cegnev, ceg_email, credits FROM companies'
    );
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a cégek lekérdezése során' });
  }
});

// Kérdőívek listázása
router.get('/surveys', isAdmin, async (req, res) => {
    try {
      const [surveys] = await db.promise().query(`
        SELECT s.id, s.title, s.mintavetel, 
        DATE_FORMAT(s.date_created, '%Y-%m-%d') as created_date,
        c.cegnev as company_name
        FROM survey_set s
        LEFT JOIN company_connections cc ON s.id = cc.connection_id AND cc.connection_type = 'survey'
        LEFT JOIN companies c ON cc.company_id = c.id
      `);
      res.json(surveys);
    } catch (error) {
      console.error('Error fetching surveys:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch surveys', details: error.message });
    }
  });

// Felhasználó módosítása
router.put('/users/:id', isAdmin, async (req, res) => {
  const { name, email, credits, role } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE users SET name = ?, email = ?, credits = ?, role = ? WHERE id = ?',
      [name, email, credits, role, req.params.id]
    );
    res.json({ message: 'Felhasználó sikeresen frissítve' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba a felhasználó frissítése során' });
  }
});

// Cég módosítása
router.put('/companies/:id', isAdmin, async (req, res) => {
  const { cegnev, ceg_email, credits } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE companies SET cegnev = ?, ceg_email = ?, credits = ? WHERE id = ?',
      [cegnev, ceg_email, credits, req.params.id]
    );
    res.json({ message: 'Cég sikeresen frissítve' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba a cég frissítése során' });
  }
});

// Kérdőív törlése
router.delete('/surveys/:id', isAdmin, async (req, res) => {
  try {
    await db.promise().query('DELETE FROM survey_set WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kérdőív sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Hiba a kérdőív törlése során' });
  }
});


router.post('/create-survey', isAdmin, async (req, res) => {
  const { title, questions, participantCount, filterCriteria, creditCost, companyId } = req.body;
  
  try {
    // Kérdőív létrehozása
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

    res.status(201).json({ message: 'Survey created successfully', surveyId });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

router.get('/companies-list', isAdmin, async (req, res) => {
  try {
    const [companies] = await db.promise().query(
      'SELECT id, cegnev FROM companies'
    );
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies list' });
  }
});

module.exports = router;