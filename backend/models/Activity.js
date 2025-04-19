const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: String,
  description: String,
  serialNumber: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
