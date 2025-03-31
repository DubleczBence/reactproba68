const db = require('../config/db');

const AnswerModel = require('../models/answerModel');

class HomeController {
  static async submitDemographics(req, res) {
    const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;
    
    if (!vegzettseg || !korcsoport || !regio || !nem || !anyagi) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }
    
    if (!Date.parse(korcsoport)) {
      return res.status(400).json({ error: 'Érvénytelen dátum formátum!' });
    }

    try {
      const userId = req.user.id;

      await db.promise().query('START TRANSACTION');

      const responseId = await AnswerModel.createUserResponse({
        userId,
        korcsoport,
        vegzettseg,
        regio,
        nem,
        anyagi
      });

      await AnswerModel.connectResponseToUser(userId, responseId);

      await db.promise().query('COMMIT');

      res.status(201).json({ message: 'Küldés sikeres!' });
    } catch (error) {
      await db.promise().query('ROLLBACK');
      console.error('Hiba történt a küldés közben:', error);
      res.status(500).json({ error: 'Hiba történt a küldés során.' });
    }
  }

  static async checkFormFilled(req, res) {
    const userId = req.user.id;

    try {
      const isFormFilled = await AnswerModel.checkFormFilled(userId);
      res.status(200).json({ isFormFilled });
    } catch (error) {
      console.error('Hiba történt a kérdőív kitöltésének ellenőrzése közben:', error);
      res.status(500).json({ error: 'Hiba történt a kérdőív kitöltésének ellenőrzése során.' });
    }
  }
}

module.exports = HomeController;