const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  images: { type: [String], required: true }, // Store images as an array of base64 strings
  numberPlate: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  color: { type: String, required: true },
  lastServiceDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user (owner)
});

module.exports = mongoose.model('Car', carSchema);
