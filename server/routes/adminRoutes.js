const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  deleteUser, 
  getTurfs, 
  createTurf, 
  updateTurf, 
  deleteTurf,
  getBookings,
  updateBookingStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/turfs', protect, admin, getTurfs);
router.post('/turfs', protect, admin, createTurf);
router.put('/turfs/:id', protect, admin, updateTurf);
router.delete('/turfs/:id', protect, admin, deleteTurf);
router.get('/bookings', protect, admin, getBookings);
router.put('/bookings/:id', protect, admin, updateBookingStatus);

module.exports = router;