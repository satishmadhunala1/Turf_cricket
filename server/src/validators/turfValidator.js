const { body, query } = require('express-validator');

exports.createTurfValidator = [
  body('name').trim().notEmpty().withMessage('Turf name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('pricePerHour').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.area').trim().notEmpty().withMessage('Area is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
];

exports.searchTurfValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
];
