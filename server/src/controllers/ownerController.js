const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id, isActive: true }).select('_id name');
  const turfIds = turfs.map((t) => t._id);

  const [bookings, revenue, reviews, upcoming] = await Promise.all([
    Booking.countDocuments({ turf: { $in: turfIds } }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $lookup: { from: 'bookings', localField: 'booking', foreignField: '_id', as: 'booking' } },
      { $unwind: '$booking' },
      { $match: { 'booking.turf': { $in: turfIds } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Review.countDocuments({ turf: { $in: turfIds } }),
    Booking.find({
      turf: { $in: turfIds },
      bookingDate: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] },
    })
      .populate('user', 'name phone')
      .populate('turf', 'name')
      .sort('bookingDate')
      .limit(10),
  ]);

  ApiResponse.success(res, {
    stats: {
      turfs: turfs.length,
      bookings,
      revenue: revenue[0]?.total || 0,
      reviews,
    },
    turfs,
    upcomingBookings: upcoming,
  });
});

exports.getMyTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id }).sort('-createdAt');
  ApiResponse.success(res, turfs);
});

exports.getBookings = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id }).select('_id');
  const turfIds = turfs.map((t) => t._id);

  const filter = { turf: { $in: turfIds } };
  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('user', 'name email phone')
    .populate('turf', 'name location')
    .sort('-createdAt');

  ApiResponse.success(res, bookings);
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('turf');
  if (!booking) throw ApiError.notFound('Booking not found');

  if (booking.turf.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  booking.status = req.body.status;
  await booking.save();
  ApiResponse.success(res, booking, 'Booking status updated');
});

exports.getRevenue = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id }).select('_id');
  const turfIds = turfs.map((t) => t._id);

  const revenue = await Booking.aggregate([
    { $match: { turf: { $in: turfIds }, status: { $in: ['confirmed', 'completed'] } } },
    {
      $group: {
        _id: { year: { $year: '$bookingDate' }, month: { $month: '$bookingDate' } },
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  ApiResponse.success(res, revenue);
});

exports.getReviews = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ owner: req.user._id }).select('_id');
  const reviews = await Review.find({ turf: { $in: turfs.map((t) => t._id) } })
    .populate('user', 'name avatar')
    .populate('turf', 'name')
    .sort('-createdAt');
  ApiResponse.success(res, reviews);
});

exports.updateSlots = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) throw ApiError.notFound('Turf not found');
  if (turf.owner.toString() !== req.user._id.toString()) throw ApiError.forbidden();

  if (req.body.operatingHours) turf.operatingHours = req.body.operatingHours;
  if (req.body.defaultSlots) turf.defaultSlots = req.body.defaultSlots;
  if (req.body.pricePerHour) turf.pricePerHour = req.body.pricePerHour;

  await turf.save();
  ApiResponse.success(res, turf, 'Slots and pricing updated');
});
