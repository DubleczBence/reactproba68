const db = require('../config/db');

class ConnectionModel {
  static async createSurveyConnection(surveyId, connectionType, connectionId) {
    await db.promise().query(
      'INSERT INTO survey_connections (survey_id, connection_type, connection_id) VALUES (?, ?, ?)',
      [surveyId, connectionType, connectionId]
    );
  }

  static async createUserConnection(userId, connectionType, connectionId) {
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, ?, ?)',
      [userId, connectionType, connectionId]
    );
  }

  static async createCompanyConnection(companyId, connectionType, connectionId) {
    await db.promise().query(
      'INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) VALUES (?, ?, ?, NOW())',
      [companyId, connectionType, connectionId]
    );
  }

  static async getSurveyConnections(surveyId, connectionType) {
    const [connections] = await db.promise().query(
      `SELECT * FROM survey_connections 
       WHERE survey_id = ? AND connection_type = ?`,
      [surveyId, connectionType]
    );
    return connections;
  }

  static async getUserConnections(userId, connectionType) {
    const [connections] = await db.promise().query(
      `SELECT * FROM user_connections 
       WHERE user_id = ? AND connection_type = ?`,
      [userId, connectionType]
    );
    return connections;
  }

  static async getCompanyConnections(companyId, connectionType) {
    const [connections] = await db.promise().query(
      `SELECT * FROM company_connections 
       WHERE company_id = ? AND connection_type = ?`,
      [companyId, connectionType]
    );
    return connections;
  }
}

module.exports = ConnectionModel;