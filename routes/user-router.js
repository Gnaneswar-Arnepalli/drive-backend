const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user-models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET register page
router.get('/register', (req, res) => {
  res.render('register');
});

// POST register
router.post(
  '/register',
  body('username').trim().isLength({ min: 3 }),
  body('email').trim().isEmail().isLength({ min: 13 }),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Data',
      });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    // After registering, redirect to login page
    res.redirect('/user/login');
  }
);

// GET login page
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login
router.post(
  '/login',
  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data',
      });
    }

    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
      // Redirect to register page if user not found
      return res.redirect('/user/register');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Redirect to register if password doesn't match
      return res.redirect('/user/register');
    }

    const token = jwt.sign(
      {
        userid: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    res.cookie('token', token);

    // Redirect to home page after successful login
    res.redirect('/home');
  }
);

module.exports = router;
