const Review = require('../models/Review');
const Turf = require('../models/Turf');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const updateTurfRating = async (turfId) => {
  const stats = await Review.aggregate([
    { $match: { turf: turfId, isVisible: true } },
    { $group: { _id: '$turf', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length) {
    await Turf.findByIdAndUpdate(turfId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
};

exports.createReview = asyncHandler(async (req, res) => {
  const { turfId } = req.params;
  const { rating, comment, bookingId } = req.body;

  const turf = await Turf.findById(turfId);
  if (!turf) throw ApiError.notFound('Turf not found');

  const existing = await Review.findOne({ user: req.user._id, turf: turfId });
  if (existing) throw ApiError.conflict('You have already reviewed this turf');

  const review = await Review.create({
    user: req.user._id,
    turf: turfId,
    booking: bookingId,
    rating,
    comment,
  });

  await updateTurfRating(turfId);
  await review.populate('user', 'name avatar');

  ApiResponse.created(res, review, 'Review submitted');
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden();
  }

  const turfId = review.turf;
  await review.deleteOne();
  await updateTurfRating(turfId);

  ApiResponse.noContent(res);
});
