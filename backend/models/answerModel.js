const db = require('../config/db');

class AnswerModel {
  static async createAnswer(userId, questionId, value) {
    const [answerResult] = await db.promise().query(
      'INSERT INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)',
      [userId, questionId, JSON.stringify(value)]
    );
    
    return answerResult.insertId;
  }

  static async connectToUser(userId, answerId) {
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "answer", ?)',
      [userId, answerId]
    );
  }

  static async connectToSurvey(surveyId, answerId) {
    await db.promise().query(
      'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "answer", ?)',
      [surveyId, answerId]
    );
  }

  static async getUserResponses(userId) {
    const [responses] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );
    return responses;
  }

  static async createUserResponse(responseData) {
    const { userId, korcsoport, vegzettseg, regio, nem, anyagi } = responseData;
    
    const [responseResult] = await db.promise().query(
      'INSERT INTO users_responses (user_id, korcsoport, vegzettseg, regio, nem, anyagi_helyzet) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, new Date(korcsoport), vegzettseg, regio, nem, anyagi]
    );
    
    return responseResult.insertId;
  }

  static async connectResponseToUser(userId, responseId) {
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "response", ?)',
      [userId, responseId]
    );
  }

  static async checkFormFilled(userId) {
    const [responses] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );
    return responses.length > 0;
  }
}

module.exports = AnswerModel;