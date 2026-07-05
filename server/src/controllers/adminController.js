const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const [users, turfs, bookings, revenue, recentBookings] = await Promise.all([
    User.countDocuments(),
    Turf.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.find()
      .populate('user', 'name email')
      .populate('turf', 'name')
      .populate('payment')
      .sort('-createdAt')
      .limit(10),
  ]);

  const stats = {
    users,
    turfs,
    bookings,
    revenue: revenue[0]?.total || 0,
    pendingBookings: await Booking.countDocuments({ status: 'pending' }),
    confirmedBookings: await Booking.countDocuments({ status: 'confirmed' }),
  };

  ApiResponse.success(res, { stats, recentBookings });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  const topTurfs = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$turf', bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { bookings: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'turfs', localField: '_id', foreignField: '_id', as: 'turf' } },
    { $unwind: '$turf' },
    { $project: { name: '$turf.name', bookings: 1, revenue: 1 } },
  ]);

  ApiResponse.success(res, { monthlyRevenue, topTurfs });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) filter.name = new RegExp(req.query.search, 'i');

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  ApiResponse.paginated(
    res,
    users.map((u) => u.toPublicJSON()),
    { page, limit, total, pages: Math.ceil(total / limit) }
  );
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  const { role, isActive } = req.body;
  if (role) user.role = role;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  await user.save();

  ApiResponse.success(res, { user: user.toPublicJSON() }, 'User updated');
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.badRequest('Cannot delete admin');

  user.isActive = false;
  await user.save();
  ApiResponse.noContent(res);
});

exports.getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'name email')
      .populate('turf', 'name location')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, bookings, { page, limit, total, pages: Math.ceil(total / limit) });
});

exports.getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('booking')
    .sort('-createdAt')
    .limit(50);
  ApiResponse.success(res, payments);
});

exports.sendNotification = asyncHandler(async (req, res) => {
  const { userIds, title, message, type = 'general' } = req.body;
  const { createNotification } = require('../services/notificationService');

  const targets = userIds?.length
    ? userIds
    : (await User.find({ isActive: true }).select('_id')).map((u) => u._id);

  await Promise.all(
    targets.map((userId) => createNotification({ userId, type, title, message }))
  );

  ApiResponse.success(res, { sent: targets.length }, 'Notifications sent');
});
