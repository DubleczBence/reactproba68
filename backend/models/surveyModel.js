const db = require('../config/db');

class SurveyModel {
  static async create(surveyData) {
    const { title, participantCount, filterCriteria, creditCost, description = "Default survey description" } = surveyData;
    
    const currentDate = new Date();
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    const [surveyResult] = await db.promise().query(
      `INSERT INTO survey_set (
        title, description, mintavetel, 
        vegzettseg, korcsoport, regio, nem, anyagi, credit_cost, is_active,
        start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        title, description, participantCount,
        filterCriteria.vegzettseg || null,
        filterCriteria.korcsoport || null,
        filterCriteria.regio || null,
        filterCriteria.nem || null,
        filterCriteria.anyagi || null,
        creditCost,
        currentDate,
        endDate
      ]
    );
  
    return surveyResult.insertId;
  }

  static async connectToCompany(surveyId, companyId) {
    await db.promise().query(
      'INSERT INTO company_connections (company_id, connection_type, connection_id) VALUES (?, "survey", ?)',
      [companyId, surveyId]
    );
  }

  static async addQuestion(surveyId, question) {
    const [questionResult] = await db.promise().query(
      'INSERT INTO questions (question, frm_option, type, order_by) VALUES (?, ?, ?, ?)',
      [question.questionText, JSON.stringify(question.options), question.selectedButton, question.order_by || 0]
    );
    
    await db.promise().query(
      'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, "question", ?)',
      [surveyId, questionResult.insertId]
    );
    
    return questionResult.insertId;
  }

  static async getSurveyById(surveyId) {
    const [survey] = await db.promise().query(
      `SELECT s.*, q.* 
       FROM survey_set s
       LEFT JOIN survey_connections sc ON s.id = sc.survey_id AND sc.connection_type = 'question'
       LEFT JOIN questions q ON sc.connection_id = q.id
       WHERE s.id = ?`,
      [surveyId]
    );
    return survey;
  }

  static async getSurveyStatus(surveyId) {
    const [survey] = await db.promise().query(
      `SELECT s.title, s.mintavetel, COUNT(DISTINCT uc.user_id) as completion_count 
       FROM survey_set s 
       LEFT JOIN survey_connections sc ON s.id = sc.survey_id AND sc.connection_type = 'answer'
       LEFT JOIN answers a ON sc.connection_id = a.id
       LEFT JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE s.id = ? 
       GROUP BY s.id`,
      [surveyId]
    );
    
    if (!survey || survey.length === 0) {
      return {
        title: '',
        mintavetel: 0,
        completion_count: 0
      };
    }
    
    return survey[0];
  }

  static async getCompanySurveys(companyId) {
    const [surveys] = await db.promise().query(
      `SELECT s.id, s.title, s.mintavetel, 
       DATE_FORMAT(s.date_created, '%Y-%m-%d') as created_date,
       COUNT(DISTINCT uc.user_id) as completion_count,
       ROUND((COUNT(DISTINCT uc.user_id) / s.mintavetel * 100)) as completion_percentage
       FROM survey_set s 
       JOIN company_connections cc ON s.id = cc.connection_id AND cc.connection_type = 'survey'
       LEFT JOIN survey_connections sc ON s.id = sc.survey_id AND sc.connection_type = 'answer'
       LEFT JOIN answers a ON sc.connection_id = a.id
       LEFT JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE cc.company_id = ? 
       GROUP BY s.id
       ORDER BY s.date_created DESC`,
      [companyId]
    );
    return surveys;
  }

  static async getAvailableSurveys(userData) {
    const { user_id, vegzettseg, korcsoport, regio, nem, anyagi_helyzet } = userData;
    
    const [surveys] = await db.promise().query(`
      SELECT s.id, s.title, s.credit_cost FROM survey_set s
      WHERE s.id NOT IN (
        SELECT DISTINCT sc.survey_id 
        FROM answers a
        JOIN survey_connections sc ON a.id = sc.connection_id AND sc.connection_type = 'answer'
        JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
        WHERE uc.user_id = ?
      )
      AND (s.vegzettseg IS NULL OR s.vegzettseg = ?)
      AND (s.korcsoport IS NULL OR s.korcsoport = ?)
      AND (s.regio IS NULL OR s.regio = ?)
      AND (s.nem IS NULL OR s.nem = ?)
      AND (s.anyagi IS NULL OR s.anyagi = ?)
      AND s.is_active = 1
      ORDER BY s.date_created DESC`,
      [
        user_id,
        vegzettseg,
        korcsoport,
        regio,
        nem,
        anyagi_helyzet
      ]
    );
    
    return surveys;
  }

  static async getSurveyQuestions(surveyId) {
    const [questions] = await db.promise().query(
      `SELECT q.id, q.question, q.frm_option, q.type
       FROM questions q
       JOIN survey_connections sc ON q.id = sc.connection_id AND sc.connection_type = 'question'
       WHERE sc.survey_id = ?`,
      [surveyId]
    );
    return questions;
  }

  static async getSurveyAnswers(surveyId) {
    const [questions] = await db.promise().query(
      `SELECT q.id, q.question, q.frm_option, q.type,
        COUNT(DISTINCT uc.user_id) as total_responses
       FROM questions q
       JOIN survey_connections sc ON q.id = sc.connection_id AND sc.connection_type = 'question'
       LEFT JOIN answers a ON q.id = a.question_id
       LEFT JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE sc.survey_id = ?
       GROUP BY q.id`,
      [surveyId]
    );

    return questions;
  }

  static async getTextAnswers(questionId) {
    const [textAnswers] = await db.promise().query(
      `SELECT a.answer 
       FROM answers a
       JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE a.question_id = ?`,
      [questionId]
    );
    return textAnswers;
  }

  static async getAnswerCounts(questionId) {
    const [answerCounts] = await db.promise().query(
      `SELECT a.answer, COUNT(*) as count
       FROM answers a
       JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE a.question_id = ?
       GROUP BY a.answer`,
      [questionId]
    );
    return answerCounts;
  }

  static async closeSurvey(surveyId, endDate = new Date()) {
    await db.promise().query(
      'UPDATE survey_set SET is_active = 0, end_date = ? WHERE id = ?',
      [endDate, surveyId]
    );
  }

  static async checkSurveyOwnership(companyId, surveyId) {
    const [surveyOwnership] = await db.promise().query(
      `SELECT * FROM company_connections 
       WHERE company_id = ? AND connection_id = ? AND connection_type = 'survey'`,
      [companyId, surveyId]
    );
    return surveyOwnership.length > 0;
  }

  static async getSurveyDemographics(surveyId) {
    const [demographics] = await db.promise().query(
      `SELECT 
        ur.vegzettseg,
        ur.nem,
        ur.regio,
        ur.anyagi_helyzet as anyagi,
        TIMESTAMPDIFF(YEAR, ur.korcsoport, CURDATE()) as eletkor
       FROM users_responses ur
       JOIN user_connections uc ON ur.user_id = uc.user_id
       JOIN survey_connections sc ON uc.connection_id = sc.connection_id
       JOIN answers a ON sc.connection_id = a.id
       WHERE sc.survey_id = ? AND sc.connection_type = 'answer' AND uc.connection_type = 'answer'
       GROUP BY ur.user_id, ur.vegzettseg, ur.nem, ur.regio, ur.anyagi_helyzet, ur.korcsoport`,
      [surveyId]
    );
    return demographics;
  }

  static async getAllSurveys() {
    const [surveys] = await db.promise().query(`
      SELECT s.id, s.title, s.mintavetel, 
      DATE_FORMAT(s.date_created, '%Y-%m-%d') as created_date,
      c.cegnev as company_name
      FROM survey_set s
      LEFT JOIN company_connections cc ON s.id = cc.connection_id AND cc.connection_type = 'survey'
      LEFT JOIN companies c ON cc.company_id = c.id
    `);
    return surveys;
  }

  static async deleteSurvey(surveyId) {
    await db.promise().query('DELETE FROM survey_set WHERE id = ?', [surveyId]);
  }

  static async getNotifications(companyId, lastSeenAnswerId) {
    const [notifications] = await db.promise().query(
      `SELECT s.id, s.title, COUNT(DISTINCT uc.user_id) as new_responses
       FROM survey_set s
       JOIN company_connections cc ON s.id = cc.connection_id AND cc.connection_type = 'survey'
       JOIN survey_connections sc ON s.id = sc.survey_id AND sc.connection_type = 'answer'
       JOIN answers a ON sc.connection_id = a.id
       JOIN user_connections uc ON a.id = uc.connection_id AND uc.connection_type = 'answer'
       WHERE cc.company_id = ? 
       AND a.id > ?
       GROUP BY s.id
       HAVING new_responses > 0
       ORDER BY MAX(a.date_created) DESC`,
      [companyId, lastSeenAnswerId]
    );
    return notifications;
  }

  static async getMaxAnswerId(companyId) {
    const [maxAnswerRows] = await db.promise().query(
      `SELECT MAX(a.id) as max_answer_id
       FROM answers a
       JOIN survey_connections sc ON a.id = sc.connection_id AND sc.connection_type = 'answer'
       JOIN survey_set s ON sc.survey_id = s.id
       JOIN company_connections cc ON s.id = cc.connection_id AND cc.connection_type = 'survey'
       WHERE cc.company_id = ?`,
      [companyId]
    );
    
    return maxAnswerRows.length > 0 ? (maxAnswerRows[0].max_answer_id || 0) : 0;
  }
}

module.exports = SurveyModel;