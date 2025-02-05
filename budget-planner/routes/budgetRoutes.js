const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Add Budget (GET)
router.get('/add-budget', (req, res) => {
  res.render('dashboard/add-budget');
});

// Add Budget (POST)
router.post('/add-budget', async (req, res) => {
  try {
    const { month, year, totalIncome } = req.body;
    await Budget.create(req.session.user.id, month, year, totalIncome);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error creating budget');
  }
});

module.exports = router;