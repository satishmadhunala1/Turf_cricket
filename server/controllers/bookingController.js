const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { turf, bookingDate, startTime, endTime, totalAmount } = req.body;

  const turfExists = await Turf.findById(turf);
  if (!turfExists) {
    res.status(400);
    throw new Error('Turf not found');
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    turf,
    bookingDate,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    ],
  });

  if (overlappingBooking) {
    res.status(400);
    throw new Error('This slot is already booked');
  }

  const booking = await Booking.create({
    user: req.user._id,
    turf,
    bookingDate,
    startTime,
    endTime,
    totalAmount,
    paymentStatus: 'Pending',
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error('Invalid booking data');
  }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('turf', 'name location image pricePerHour')
    .populate('user', 'name email');
  res.json(bookings);
});

module.exports = {
  createBooking,
  getMyBookings,
};