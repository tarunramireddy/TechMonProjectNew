const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  assignedTo: { type: String },
  employeeId: { type: String, required: true },
  serialNumber: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('Asset', AssetSchema);
