const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Login Page (GET)
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).send('Invalid email/password');
    
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Invalid email/password');

    req.session.user = { id: user.id, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Registration Page (GET)
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Registration (POST)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.redirect('/login');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') res.status(400).send('Email already exists');
    else res.status(500).send('Server error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;