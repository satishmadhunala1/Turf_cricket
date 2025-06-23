const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all turfs (admin)
// @route   GET /api/admin/turfs
// @access  Private/Admin
const getTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({});
  res.json(turfs);
});

// @desc    Create new turf
// @route   POST /api/admin/turfs
// @access  Private/Admin
const createTurf = asyncHandler(async (req, res) => {
  const { name, location, pricePerHour, size, image, description, facilities } = req.body;

  const turf = await Turf.create({
    name,
    location,
    pricePerHour,
    size,
    image,
    description,
    facilities,
  });

  if (turf) {
    res.status(201).json(turf);
  } else {
    res.status(400);
    throw new Error('Invalid turf data');
  }
});

// @desc    Update turf
// @route   PUT /api/admin/turfs/:id
// @access  Private/Admin
const updateTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);

  if (turf) {
    turf.name = req.body.name || turf.name;
    turf.location = req.body.location || turf.location;
    turf.pricePerHour = req.body.pricePerHour || turf.pricePerHour;
    turf.size = req.body.size || turf.size;
    turf.image = req.body.image || turf.image;
    turf.description = req.body.description || turf.description;
    turf.facilities = req.body.facilities || turf.facilities;

    const updatedTurf = await turf.save();
    res.json(updatedTurf);
  } else {
    res.status(404);
    throw new Error('Turf not found');
  }
});

// @desc    Delete turf
// @route   DELETE /api/admin/turfs/:id
// @access  Private/Admin
const deleteTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);

  if (turf) {
    await turf.remove();
    res.json({ message: 'Turf removed' });
  } else {
    res.status(404);
    throw new Error('Turf not found');
  }
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('turf', 'name location');
  res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.paymentStatus = req.body.status || booking.paymentStatus;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

module.exports = {
  getUsers,
  deleteUser,
  getTurfs,
  createTurf,
  updateTurf,
  deleteTurf,
  getBookings,
  updateBookingStatus,
};