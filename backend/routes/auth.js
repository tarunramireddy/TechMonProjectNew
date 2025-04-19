const express = require('express');
const router = express.Router();
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Sign Up Route
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name, email } });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Sign In Route
router.post('/signin', async (req, res) => {

  console.log('🔥 Backend /signin hit');
  console.log('📨 Payload:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, message: 'Sign In successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ success:false, message:'Server error' });
  }
});


module.exports = router;