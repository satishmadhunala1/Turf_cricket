const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  facilities: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;