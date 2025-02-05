const pool = require('./db');

class Budget {
  static async create(userId, month, year, totalIncome) {
    const [result] = await pool.query(
      'INSERT INTO budgets (user_id, month, year, total_income) VALUES (?, ?, ?, ?)',
      [userId, month, year, totalIncome]
    );
    return result.insertId;
  }
}

module.exports = Budget;