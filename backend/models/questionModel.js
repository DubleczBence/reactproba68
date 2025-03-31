const db = require('../config/db');

class QuestionModel {
  static async create(questionData) {
    const { questionText, options, selectedButton } = questionData;
    
    const [questionResult] = await db.promise().query(
      'INSERT INTO questions (question, frm_option, type) VALUES (?, ?, ?)',
      [questionText, JSON.stringify(options), selectedButton]
    );
    
    return questionResult.insertId;
  }

  static async getById(questionId) {
    const [questions] = await db.promise().query(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );
    return questions.length > 0 ? questions[0] : null;
  }

  static async getQuestionsForSurvey(surveyId) {
    const [questions] = await db.promise().query(
      `SELECT q.* FROM questions q
       JOIN survey_connections sc ON q.id = sc.connection_id
       WHERE sc.survey_id = ? AND sc.connection_type = 'question'
       ORDER BY q.order_by`,
      [surveyId]
    );
    return questions;
  }
}

module.exports = QuestionModel;