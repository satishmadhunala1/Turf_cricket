const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
// In routes/bookingRoutes.js
router.post('/api/bookings', createBooking);

router.get('/mybookings', protect, getMyBookings);

module.exports = router;