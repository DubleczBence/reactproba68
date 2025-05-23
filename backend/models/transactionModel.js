const db = require('../config/db');

class TransactionModel {
  static async createCreditTransaction(amount, type, entityId = null, isCompany = false) {
    const validTypes = isCompany ? ['spend', 'purchase'] : ['survey', 'purchase'];
    
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid transaction type: ${type}. Valid types for ${isCompany ? 'companies' : 'users'} are: ${validTypes.join(', ')}`);
    }
    
    let result;
    
    if (isCompany) {
      [result] = await db.promise().query(
        `INSERT INTO credit_transactions (amount, transaction_type, created_at) VALUES (?, ?, NOW())`,
        [amount, type]
      );
      
      if (entityId) {
        await db.promise().query(
          `INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
          [entityId, result.insertId]
        );
      }
    } else {
      [result] = await db.promise().query(
        `INSERT INTO transactions (user_id, amount, transaction_type, transaction_date) VALUES (?, ?, ?, NOW())`,
        [entityId, amount, type]
      );

      if (entityId) {
        await db.promise().query(
          `INSERT INTO user_connections (user_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
          [entityId, result.insertId]
        );
      }
    }
    
    return result.insertId;
  }

  static async connectToCompany(companyId, transactionId) {
    try {
      await db.promise().query(
        `INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
        [companyId, transactionId]
      );
    } catch (error) {
      console.error('Error connecting transaction to company:', error);
      throw error;
    }
  }

  static async connectToUser(userId, transactionId) {
    try {
      await db.promise().query(
        `INSERT INTO user_connections (user_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
        [userId, transactionId]
      );
    } catch (error) {
      console.error('Error connecting transaction to user:', error);
      throw error;
    }
  }
  
  static async connectToSurvey(surveyId, transactionId, isCompany = false) {
    try {
      if (isCompany) {
        await db.promise().query(
          `INSERT INTO survey_connections (survey_id, connection_type, connection_id, created_at) 
           VALUES (?, 'transaction', ?, NOW())`,
          [surveyId, transactionId]
        );
      } else {
        await db.promise().query(
          `UPDATE transactions SET survey_id = ? WHERE id = ?`,
          [surveyId, transactionId]
        );
      }
    } catch (error) {
      console.error('Error connecting transaction to survey:', error);
      throw error;
    }
  }

  static async getCompanyCreditHistory(companyId) {
    const [transactions] = await db.promise().query(
      `SELECT 
        ct.*,
        DATE_FORMAT(ct.created_at, '%Y-%m-%d %H:%i') as formatted_date
       FROM credit_transactions ct
       JOIN company_connections cc ON ct.id = cc.connection_id
       WHERE cc.company_id = ? AND cc.connection_type = 'transaction'
       ORDER BY ct.created_at DESC`,
      [companyId]
    );
    return transactions;
  }

  static async createUserTransaction(transactionData) {
    const { userId, amount, transactionType, voucherName } = transactionData;
    
    const [transactionResult] = await db.promise().query(
      `INSERT INTO transactions 
       (user_id, amount, transaction_type, transaction_date, voucher_name) 
       VALUES (?, ?, ?, NOW(), ?)`,
      [userId, amount, transactionType, voucherName]
    );
    
    return transactionResult.insertId;
  }

  static async getUserCreditHistory(userId) {
    const [transactions] = await db.promise().query(
      `SELECT t.* FROM transactions t
       JOIN user_connections uc ON t.id = uc.connection_id 
       WHERE uc.user_id = ? AND uc.connection_type = 'transaction'
       ORDER BY t.transaction_date DESC`,
      [userId]
    );
    return transactions;
  }
}

module.exports = TransactionModel;