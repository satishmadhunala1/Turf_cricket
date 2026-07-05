const { body } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
];

exports.loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.otpValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

exports.forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
];

exports.resetPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.googleLoginValidator = [
  body('credential').notEmpty().withMessage('Google credential is required'),
];
