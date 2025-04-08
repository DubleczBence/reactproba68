const db = require('../config/db');

class TransactionModel {
  static async createCreditTransaction(amount, type, entityId = null, isCompany = false) {
    // Különböző validálás a felhasználók és cégek számára
    const validTypes = isCompany ? ['spend', 'purchase'] : ['survey', 'purchase'];
    
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid transaction type: ${type}. Valid types for ${isCompany ? 'companies' : 'users'} are: ${validTypes.join(', ')}`);
    }
    
    let result;
    
    if (isCompany) {
      // Céges tranzakció létrehozása a credit_transactions táblában
      [result] = await db.promise().query(
        `INSERT INTO credit_transactions (amount, transaction_type, created_at) VALUES (?, ?, NOW())`,
        [amount, type]
      );
      
      // Kapcsolat létrehozása a company_connections táblában
      if (entityId) {
        await db.promise().query(
          `INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
          [entityId, result.insertId]
        );
      }
    } else {
      // Felhasználói tranzakció létrehozása a transactions táblában
      [result] = await db.promise().query(
        `INSERT INTO transactions (user_id, amount, transaction_type, transaction_date) VALUES (?, ?, ?, NOW())`,
        [entityId, amount, type]
      );
      
      // Kapcsolat létrehozása a user_connections táblában
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
      // Create a connection in the company_connections table
      await db.promise().query(
        `INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) VALUES (?, 'transaction', ?, NOW())`,
        [companyId, transactionId]
      );
    } catch (error) {
      console.error('Error connecting transaction to company:', error);
      throw error;
    }
  }
  
  static async connectToSurvey(surveyId, transactionId, isCompany = false) {
    const table = isCompany ? 'credit_transactions' : 'transactions';
    
    await db.promise().query(
      `UPDATE ${table} SET survey_id = ? WHERE id = ?`,
      [surveyId, transactionId]
    );
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