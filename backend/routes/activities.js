const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.get('/recent', async (req, res) => {
  try {
    const recent = await Activity.find().sort({ timestamp: -1 }).limit(2);
    res.json({ recent });
  } catch (err) {
    console.error('Error fetching recent activities:', err);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});
  

module.exports = router;
