const express = require('express');
const router = express.Router();
const db = require('../db'); 
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f';


router.post('/home', async (req, res) => {
  const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;

  
  if (!vegzettseg || !korcsoport || !regio || !nem || !anyagi) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }

  
   if (!Date.parse(korcsoport)) {
    return res.status(400).json({ error: 'Érvénytelen dátum formátum!' });
  }

  try {

   
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id; 

 
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


router.get('/available-surveys', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;

  try {
    
    const [userResponse] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );

    if (userResponse.length === 0) {
      return res.status(200).json({ surveys: [] });
    }

    const userData = userResponse[0];

    
    const [surveys] = await db.promise().query(`
      SELECT * FROM survey_set s
      WHERE s.id NOT IN (SELECT survey_id FROM answers WHERE user_id = ?)
      AND (s.vegzettseg IS NULL OR s.vegzettseg = ?)
      AND (s.korcsoport IS NULL OR s.korcsoport = ?)
      AND (s.regio IS NULL OR s.regio = ?)
      AND (s.nem IS NULL OR s.nem = ?)
      AND (s.anyagi IS NULL OR s.anyagi = ?)`,
      [
        userId,
        userData.vegzettseg,
        userData.korcsoport,
        userData.regio,
        userData.nem,
        userData.anyagi_helyzet
      ]
    );

    res.status(200).json({ surveys });
  } catch (error) {
    console.error('Error fetching available surveys:', error);
    res.status(500).json({ error: 'Failed to fetch available surveys' });
  }
});



router.get('/survey/:id', async (req, res) => {
  try {
    const [survey] = await db.promise().query(
      `SELECT s.*, q.* 
       FROM survey_set s
       LEFT JOIN questions q ON s.id = q.survey_id
       WHERE s.id = ?`,
      [req.params.id]
    );
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});


module.exports = router;