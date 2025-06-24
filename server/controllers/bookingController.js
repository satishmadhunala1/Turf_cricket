const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
// Updated createBooking controller with better error handling
const createBooking = asyncHandler(async (req, res) => {
  try {
    const { turf, bookingDate, startTime, endTime, totalAmount } = req.body;

    // Validate required fields
    if (!turf || !bookingDate || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const turfExists = await Turf.findById(turf);
    if (!turfExists) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Check for overlapping bookings (improved query)
    const overlappingBooking = await Booking.findOne({
      turf,
      bookingDate,
      $or: [
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gt: startTime } 
        },
      ],
      status: { $ne: 'Cancelled' } // Ignore cancelled bookings
    });

    if (overlappingBooking) {
      return res.status(409).json({ 
        message: 'This slot is already booked',
        conflictingBooking: overlappingBooking 
      });
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

    return res.status(201).json({
      _id: booking._id,
      turf: booking.turf,
      user: booking.user,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({ 
      message: 'Server error during booking creation',
      error: error.message 
    });
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