const db = require('../config/db');

class VoucherModel {
  static async createVoucher(voucherData) {
    const { userId, name, creditCost } = voucherData;
    
    const [voucherResult] = await db.promise().query(
      'INSERT INTO vouchers (user_id, name, credit_cost, purchase_date) VALUES (?, ?, ?, NOW())',
      [userId, name, creditCost]
    );
    
    return voucherResult.insertId;
  }

  static async connectToUser(userId, voucherId) {
    await db.promise().query(
      'INSERT INTO user_connections (user_id, connection_type, connection_id) VALUES (?, "voucher", ?)',
      [userId, voucherId]
    );
  }

  static async getUserVouchers(userId) {
    const [vouchers] = await db.promise().query(
      `SELECT v.* FROM vouchers v
       JOIN user_connections uc ON v.id = uc.connection_id 
       WHERE uc.user_id = ? AND uc.connection_type = 'voucher'
       ORDER BY v.purchase_date DESC`,
      [userId]
    );
    return vouchers;
  }
}

module.exports = VoucherModel;