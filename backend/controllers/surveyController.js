const SurveyModel = require('../models/surveyModel');
const AnswerModel = require('../models/answerModel');
const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');
const db = require('../config/db');

class SurveyController {
  static async getSurveyById(req, res) {
    try {
      const survey = await SurveyModel.getSurveyById(req.params.id);
      res.json(survey);
    } catch (error) {
      console.error('Error fetching survey:', error);
      res.status(500).json({ error: 'Failed to fetch survey' });
    }
  }

  static async getSurveyStatus(req, res) {
    try {
      const status = await SurveyModel.getSurveyStatus(req.params.surveyId);
      res.json(status);
    } catch (error) {
      console.error('Error fetching survey status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch survey status',
        title: '',
        mintavetel: 0, 
        completion_count: 0
      });
    }
  }

  static async getCompanySurveys(req, res) {
    try {
      const surveys = await SurveyModel.getCompanySurveys(req.params.companyId);
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company surveys' });
    }
  }

  static async getAvailableSurveys(req, res) {
    try {
      const userId = req.user.id;

      const userResponses = await AnswerModel.getUserResponses(userId);
      if (userResponses.length === 0) {
        return res.status(200).json({ surveys: [] });
      }

      const userData = {
        user_id: userId,
        ...userResponses[0]
      };

      const surveys = await SurveyModel.getAvailableSurveys(userData);
      res.status(200).json({ surveys });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      console.error('Error fetching available surveys:', error);
      res.status(500).json({ error: 'Failed to fetch available surveys' });
    }
  }

  static async submitSurvey(req, res) {
    const { surveyId, answers } = req.body;
    const userId = req.user.id;
  
    try {
      // Kezdjük a tranzakciót az adatbázisban
      await db.promise().query('START TRANSACTION');
  
      const [survey] = await SurveyModel.getSurveyById(surveyId);
      const userCreditReward = Math.floor(survey.credit_cost / 3);
  
      for (const answer of answers) {
        const answerId = await AnswerModel.createAnswer(userId, answer.questionId, answer.value);
        await AnswerModel.connectToUser(userId, answerId);
        await AnswerModel.connectToSurvey(surveyId, answerId);
      }
  
      // Kredit frissítése
      await UserModel.updateCredits(userId, userCreditReward);
      
      // Tranzakció létrehozása
      const transactionId = await TransactionModel.createCreditTransaction(userCreditReward, "survey", userId);
      
      // Kapcsolat létrehozása a felhasználó és a tranzakció között
      await TransactionModel.connectToUser(userId, transactionId);
      
      // Kapcsolat létrehozása a kérdőív és a tranzakció között
      await TransactionModel.connectToSurvey(surveyId, transactionId);
  
      // Commit a tranzakciót
      await db.promise().query('COMMIT');
  
      res.status(200).json({ 
        message: 'Survey submitted successfully',
        creditsEarned: userCreditReward
      });
    } catch (error) {
      console.error('Error submitting survey:', error);
      
      // Rollback a tranzakciót hiba esetén
      try {
        await db.promise().query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
      
      res.status(500).json({ error: 'Failed to submit survey' });
    }
  }

  static async getSurveyAnswers(req, res) {
    try {
      const questions = await SurveyModel.getSurveyAnswers(req.params.surveyId);

      const surveyAnswers = await Promise.all(questions.map(async (question) => {
        if (question.type === 'text') {
          const textAnswers = await SurveyModel.getTextAnswers(question.id);
          return {
            questionText: question.question,
            type: question.type,
            answers: textAnswers.map(a => ({
              option: JSON.parse(a.answer)
            }))
          };
        }

        const options = JSON.parse(question.frm_option);
        const answerCounts = await SurveyModel.getAnswerCounts(question.id);

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
  }
}

module.exports = SurveyController;