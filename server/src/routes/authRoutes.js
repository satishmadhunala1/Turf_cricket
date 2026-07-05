const router = require('express').Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  loginValidator,
  otpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  googleLoginValidator,
} = require('../validators/authValidator');

router.post('/send-otp', otpLimiter, forgotPasswordValidator, validate, authController.sendRegisterOtp);
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/google', authLimiter, googleLoginValidator, validate, authController.googleLogin);
router.post('/forgot-password', otpLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, authController.resetPassword);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
