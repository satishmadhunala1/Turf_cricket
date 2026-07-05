const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookingValidator } = require('../validators/bookingValidator');

router.post('/', protect, createBookingValidator, validate, bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);
router.get('/:id/invoice', protect, bookingController.getInvoice);
router.get('/:id', protect, bookingController.getBookingById);
router.patch('/:id/cancel', protect, bookingController.cancelBooking);
router.post('/confirm-payment', protect, bookingController.confirmPayment);

module.exports = router;
