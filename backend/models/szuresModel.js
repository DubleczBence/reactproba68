const db = require('../config/db');

class SzuresModel {
  static async countUsers(filterCriteria) {
    const { vegzettseg, korcsoport, regio, nem, anyagi } = filterCriteria;
    
    let sql = 'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1';
    const params = [];
  
    if (vegzettseg) {
      sql += ' AND vegzettseg = ?';
      params.push(vegzettseg);
    }
    if (korcsoport) {
      const [minAge, maxAge] = korcsoport.split('-').map(Number);
      sql += ` AND TIMESTAMPDIFF(YEAR, korcsoport, CURDATE()) BETWEEN ? AND ?`;
      params.push(minAge, maxAge);
    }
    if (regio) {
      sql += ' AND regio = ?';
      params.push(regio);
    }
    if (nem) {
      sql += ' AND nem = ?';
      params.push(nem);
    }
    if (anyagi) {
      sql += ' AND anyagi_helyzet = ?';
      params.push(anyagi);
    }
  
    const [results] = await db.promise().query(sql, params);
    return results[0].count;
  }
}

module.exports = SzuresModel;