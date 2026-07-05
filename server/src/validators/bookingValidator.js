const { body } = require('express-validator');

exports.createBookingValidator = [
  body('turfId').notEmpty().withMessage('Turf ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Start time must be HH:MM format'),
  body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('End time must be HH:MM format'),
  body('paymentMethod').optional().isIn(['stripe', 'razorpay', 'cash', 'wallet']),
];

exports.reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
];
