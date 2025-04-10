const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findByEmail(email) {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users.length > 0 ? users[0] : null;
  }

  static async findById(userId) {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return users.length > 0 ? users[0] : null;
  }

  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  }

  static async getCredits(userId) {
    const [result] = await db.promise().query(
      'SELECT credits FROM users WHERE id = ?',
      [userId]
    );
    return result[0]?.credits || 0;
  }

  static async updateCredits(userId, amount) {
    await db.promise().query(
      'UPDATE users SET credits = credits + ? WHERE id = ?',
      [amount, userId]
    );
  }

  static async setResetCode(email, code) {
    const expiryTime = new Date(Date.now() + 3600000); // 1 óra
    await db.promise().query(
      'UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE email = ?',
      [code, expiryTime, email]
    );
  }

  static async verifyResetCode(email, code) {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
      [email, code]
    );
    return users.length > 0;
  }

  static async updatePassword(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query(
      'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email = ?',
      [hashedPassword, email]
    );
  }

  static async getProfile(userId) {
    const [user] = await db.promise().query(
      `SELECT u.id, u.name, u.email, 
       DATE_FORMAT(ur.korcsoport, '%Y-%m-%d') as korcsoport,
       ur.vegzettseg, ur.regio, ur.nem, ur.anyagi_helyzet as anyagi
       FROM users u
       LEFT JOIN users_responses ur ON u.id = ur.user_id
       WHERE u.id = ?`,
      [userId]
    );
    return user.length > 0 ? user[0] : null;
  }

  static async updateProfile(userId, data) {
    const { name, regio, anyagi, vegzettseg } = data;
    
    if (name !== undefined) {
      await db.promise().query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, userId]
      );
    }
    
    const [existingResponse] = await db.promise().query(
      'SELECT * FROM users_responses WHERE user_id = ?',
      [userId]
    );
    
    if (existingResponse.length > 0) {
      const updates = [];
      const params = [];
      
      if (regio !== undefined) {
        updates.push('regio = ?');
        params.push(regio);
      }
      
      if (anyagi !== undefined) {
        updates.push('anyagi_helyzet = ?');
        params.push(anyagi);
      }
      
      if (vegzettseg !== undefined) {
        updates.push('vegzettseg = ?');
        params.push(vegzettseg);
      }
      
      if (updates.length > 0) {
        params.push(userId);
        await db.promise().query(
          `UPDATE users_responses SET ${updates.join(', ')} WHERE user_id = ?`,
          params
        );
      }
    } else if (regio !== undefined || anyagi !== undefined || vegzettseg !== undefined) {
      await db.promise().query(
        `INSERT INTO users_responses (user_id, korcsoport, vegzettseg, regio, nem, anyagi_helyzet)
         VALUES (?, CURDATE(), ?, ?, '20', ?)`,
        [userId, vegzettseg || '5', regio || '14', anyagi || '23']
      );
    }
  }

  static async getAllUsers() {
    const [users] = await db.promise().query(
      'SELECT id, name, email, credits, role FROM users'
    );
    return users;
  }

  static async updateUser(userId, data) {
    const { name, email, credits, role } = data;
    await db.promise().query(
      'UPDATE users SET name = ?, email = ?, credits = ?, role = ? WHERE id = ?',
      [name, email, credits, role, userId]
    );
  }

  static async deleteUser(userId) {
    await db.promise().query(
      'DELETE FROM users_responses WHERE user_id = ?',
      [userId]
    );
    
    await db.promise().query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
  }
}

module.exports = UserModel;