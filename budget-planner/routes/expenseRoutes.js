const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Add Expense (GET)
router.get('/add', (req, res) => {
  res.render('dashboard/add-expense');
});

// Add Expense (POST)
router.post('/add', async (req, res) => {
  const { category, amount, date } = req.body;
  const userId = req.session.user.id;

  try {
    // Get the user's current budget for the month
    const [budgets] = await pool.query(
      'SELECT id FROM budgets WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (budgets.length === 0) {
      return res.status(400).send('Please set a budget first');
    }

    const budgetId = budgets[0].id;

    // Save expense
    await pool.query(
      'INSERT INTO expenses (user_id, budget_id, category, amount, date) VALUES (?, ?, ?, ?, ?)',
      [userId, budgetId, category, amount, date]
    );

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error adding expense');
  }
});

module.exports = router;