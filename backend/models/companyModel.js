const db = require('../config/db');
const bcrypt = require('bcryptjs');

class CompanyModel {
  static async findByEmail(email) {
    const [companies] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ?',
      [email]
    );
    return companies.length > 0 ? companies[0] : null;
  }

  static async findById(companyId) {
    const [companies] = await db.promise().query(
      'SELECT * FROM companies WHERE id = ?',
      [companyId]
    );
    return companies.length > 0 ? companies[0] : null;
  }

  static async create(companyData) {
    const { cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam } = companyData;
    
    const hashedPassword = await bcrypt.hash(jelszo, 10);

    const [result] = await db.promise().query(
      'INSERT INTO companies (cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cegnev, telefon, ceg_email, hashedPassword, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam]
    );
    
    return result.insertId;
  }

  static async getCredits(companyId) {
    const [result] = await db.promise().query(
      'SELECT credits FROM companies WHERE id = ?',
      [companyId]
    );
    return result[0]?.credits || 0;
  }

  static async updateCredits(companyId, amount) {
    await db.promise().query(
      'UPDATE companies SET credits = credits + ? WHERE id = ?',
      [amount, companyId]
    );
  }

  static async setResetCode(email, code) {
    const expiryTime = new Date(Date.now() + 3600000); // 1 óra
    await db.promise().query(
      'UPDATE companies SET reset_code = ?, reset_code_expires = ? WHERE ceg_email = ?',
      [code, expiryTime, email]
    );
  }

  static async verifyResetCode(email, code) {
    const [companies] = await db.promise().query(
      'SELECT * FROM companies WHERE ceg_email = ? AND reset_code = ? AND reset_code_expires > NOW()',
      [email, code]
    );
    return companies.length > 0;
  }

  static async updatePassword(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query(
      'UPDATE companies SET jelszo = ?, reset_code = NULL, reset_code_expires = NULL WHERE ceg_email = ?',
      [hashedPassword, email]
    );
  }

  static async getProfile(companyId) {
    const [company] = await db.promise().query(
      'SELECT id, cegnev, telefon, ceg_email, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam FROM companies WHERE id = ?',
      [companyId]
    );
    return company.length > 0 ? company[0] : null;
  }

  static async updateProfile(companyId, data) {
    const { cegnev, telefon } = data;
    
    const [currentData] = await db.promise().query(
      'SELECT cegnev, telefon FROM companies WHERE id = ?',
      [companyId]
    );
    
    if (currentData.length === 0) {
      throw new Error('Company not found');
    }
    
    const updatedCegnev = cegnev !== undefined ? cegnev : currentData[0].cegnev;
    const updatedTelefon = telefon !== undefined ? telefon : currentData[0].telefon;
    
    await db.promise().query(
      'UPDATE companies SET cegnev = ?, telefon = ? WHERE id = ?',
      [updatedCegnev, updatedTelefon, companyId]
    );
    
    return {
      cegnev: updatedCegnev,
      telefon: updatedTelefon
    };
  }

  static async getAllCompanies() {
    const [companies] = await db.promise().query(
      'SELECT id, cegnev, ceg_email, credits FROM companies'
    );
    return companies;
  }

  static async getCompanyList() {
    const [companies] = await db.promise().query(
      'SELECT id, cegnev FROM companies'
    );
    return companies;
  }

  static async updateCompany(companyId, data) {
    const { cegnev, ceg_email, credits } = data;
    await db.promise().query(
      'UPDATE companies SET cegnev = ?, ceg_email = ?, credits = ? WHERE id = ?',
      [cegnev, ceg_email, credits, companyId]
    );
  }

  static async recordLogin(companyId, lastSeenAnswerId) {
    const [loginResult] = await db.promise().query(
      `INSERT INTO company_logins (login_time, last_seen_answer_id) VALUES (NOW(), ?)`,
      [lastSeenAnswerId]
    );
    
    const loginId = loginResult.insertId;
    
    await db.promise().query(
      `INSERT INTO company_connections (company_id, connection_type, connection_id, created_at) 
       VALUES (?, 'login', ?, NOW())`,
      [companyId, loginId]
    );
    
    return loginId;
  }

  static async getLastLogin(companyId) {
    const [lastLoginRows] = await db.promise().query(
      `SELECT cl.login_time, cl.last_seen_answer_id
       FROM company_logins cl
       JOIN company_connections cc ON cl.id = cc.connection_id AND cc.connection_type = 'login'
       WHERE cc.company_id = ?
       ORDER BY cl.login_time DESC
       LIMIT 1`,
      [companyId]
    );
    
    return lastLoginRows.length > 0 ? lastLoginRows[0] : null;
  }

  static async deleteCompany(companyId) {
    await db.promise().query(
      'DELETE FROM company_connections WHERE company_id = ?',
      [companyId]
    );
    
    await db.promise().query(
      'DELETE FROM companies WHERE id = ?',
      [companyId]
    );
  }
}

module.exports = CompanyModel;