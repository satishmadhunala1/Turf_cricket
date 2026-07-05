const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/token');
const { createAndSendOtp, verifyOtp } = require('../services/otpService');
const { google, clientUrl } = require('../config/env');

const googleClient = google.clientId ? new OAuth2Client(google.clientId) : null;

const sendTokenResponse = (user, res, message) => {
  const token = generateToken(user._id);
  ApiResponse.success(res, { user: user.toPublicJSON(), token }, message);
};

exports.sendRegisterOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('Email already registered');

  await createAndSendOtp(email, 'register');
  ApiResponse.success(res, null, 'OTP sent to your email');
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  await verifyOtp(email, 'register', otp);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    isEmailVerified: true,
  });

  sendTokenResponse(user, res, 'Account created successfully');
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

  sendTokenResponse(user, res, 'Logged in successfully');
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!googleClient) throw ApiError.badRequest('Google login is not configured');

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: google.clientId,
  });

  const { sub: googleId, email, name, picture } = ticket.getPayload();
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      user.isEmailVerified = true;
      if (picture) user.avatar = picture;
      await user.save();
    }
  } else {
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture || '',
      isEmailVerified: true,
    });
  }

  sendTokenResponse(user, res, 'Logged in with Google');
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    ApiResponse.success(res, null, 'If the email exists, an OTP has been sent');
    return;
  }

  await createAndSendOtp(email, 'reset_password');
  ApiResponse.success(res, null, 'If the email exists, an OTP has been sent');
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  await verifyOtp(email, 'reset_password', otp);

  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('User not found');

  user.password = password;
  await user.save();

  sendTokenResponse(user, res, 'Password reset successfully');
});

exports.getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: req.user.toPublicJSON() });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();
  ApiResponse.success(res, { user: user.toPublicJSON() }, 'Profile updated');
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user.password || !(await user.matchPassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  ApiResponse.success(res, null, 'Password changed successfully');
});
