const User = require('../models/User');
const Turf = require('../models/Turf');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites', 'name coverImage location pricePerHour rating');
  ApiResponse.success(res, { user: user.toPublicJSON(), favorites: user.favorites });
});

exports.toggleFavorite = asyncHandler(async (req, res) => {
  const { turfId } = req.params;
  const turf = await Turf.findById(turfId);
  if (!turf) throw ApiError.notFound('Turf not found');

  const user = await User.findById(req.user._id);
  const index = user.favorites.indexOf(turfId);
  if (index > -1) {
    user.favorites.splice(index, 1);
  } else {
    user.favorites.push(turfId);
  }
  await user.save();

  ApiResponse.success(res, { favorites: user.favorites }, index > -1 ? 'Removed from favorites' : 'Added to favorites');
});

exports.getWallet = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { balance: req.user.wallet });
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const Notification = require('../models/Notification');
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    Notification.countDocuments({ user: req.user._id }),
  ]);

  ApiResponse.paginated(res, notifications, { page, limit, total, pages: Math.ceil(total / limit) });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const Notification = require('../models/Notification');
  await Notification.updateMany(
    { user: req.user._id, _id: { $in: req.body.ids || [req.params.id] } },
    { isRead: true }
  );
  ApiResponse.success(res, null, 'Notifications marked as read');
});
