const asyncHandler = require('express-async-handler');
const Turf = require('../models/Turf');

// @desc    Get all turfs
// @route   GET /api/turfs
// @access  Public
const getTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({});
  res.json(turfs);
});

// @desc    Get single turf by ID
// @route   GET /api/turfs/:id
// @access  Public
const getTurfById = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);

  if (turf) {
    res.json(turf);
  } else {
    res.status(404);
    throw new Error('Turf not found');
  }
});

module.exports = {
  getTurfs,
  getTurfById
};