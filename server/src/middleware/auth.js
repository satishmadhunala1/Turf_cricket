const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { jwt: config } = require('../config/env');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw ApiError.unauthorized('Not authorized — no token');

  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive) throw ApiError.unauthorized('User not found or deactivated');
    next();
  } catch {
    throw ApiError.unauthorized('Not authorized — invalid token');
  }
});

const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Role "${req.user.role}" is not authorized`);
    }
    next();
  });

module.exports = { protect, authorize };
