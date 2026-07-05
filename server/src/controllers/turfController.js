const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary } = require('../services/cloudinaryService');

const buildTurfQuery = (query) => {
  const filter = { isActive: true };
  const { city, sport, minPrice, maxPrice, minRating, amenities, search, featured } = query;

  if (city) filter['location.city'] = new RegExp(city, 'i');
  if (sport) filter.sport = sport;
  if (minPrice || maxPrice) {
    filter.pricePerHour = {};
    if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
  }
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (amenities) filter.amenities = { $all: amenities.split(',') };
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  return filter;
};

const parseSort = (sort) => {
  const map = {
    price_asc: { pricePerHour: 1 },
    price_desc: { pricePerHour: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  return map[sort] || { rating: -1 };
};

exports.getTurfs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = buildTurfQuery(req.query);
  const sort = parseSort(req.query.sort);

  const [turfs, total] = await Promise.all([
    Turf.find(filter).sort(sort).skip(skip).limit(limit).select('-defaultSlots'),
    Turf.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, turfs, { page, limit, total, pages: Math.ceil(total / limit) });
});

exports.getFeaturedTurfs = asyncHandler(async (req, res) => {
  const turfs = await Turf.find({ isActive: true, isFeatured: true })
    .sort({ rating: -1 })
    .limit(8)
    .select('-defaultSlots');
  ApiResponse.success(res, turfs);
});

exports.getPopularLocations = asyncHandler(async (req, res) => {
  const locations = await Turf.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$location.city', count: { $sum: 1 }, avgPrice: { $avg: '$pricePerHour' } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
    { $project: { city: '$_id', count: 1, avgPrice: { $round: ['$avgPrice', 0] }, _id: 0 } },
  ]);
  ApiResponse.success(res, locations);
});

exports.getTurfById = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id).populate('owner', 'name email phone');
  if (!turf || !turf.isActive) throw ApiError.notFound('Turf not found');
  ApiResponse.success(res, turf);
});

exports.getTurfBySlug = asyncHandler(async (req, res) => {
  const turf = await Turf.findOne({ slug: req.params.slug, isActive: true }).populate('owner', 'name email phone');
  if (!turf) throw ApiError.notFound('Turf not found');
  ApiResponse.success(res, turf);
});

exports.getNearbyTurfs = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) throw ApiError.notFound('Turf not found');

  const nearby = await Turf.find({
    _id: { $ne: turf._id },
    isActive: true,
    'location.city': turf.location.city,
  })
    .limit(4)
    .select('name coverImage location pricePerHour rating slug');

  ApiResponse.success(res, nearby);
});

exports.getAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const turf = await Turf.findById(req.params.id);
  if (!turf) throw ApiError.notFound('Turf not found');

  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(bookingDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const bookings = await Booking.find({
    turf: turf._id,
    bookingDate: { $gte: bookingDate, $lt: nextDay },
    status: { $in: ['pending', 'confirmed'] },
  }).select('startTime endTime');

  const { open, close } = turf.operatingHours;
  const slots = [];
  let [h, m] = open.split(':').map(Number);
  const [closeH] = close.split(':').map(Number);

  while (h < closeH) {
    const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const endH = m === 30 ? h + 1 : h;
    const endM = m === 30 ? '00' : '30';
    const end = `${String(endH).padStart(2, '0')}:${endM}`;

    const isBooked = bookings.some(
      (b) => b.startTime < end && b.endTime > start
    );

    slots.push({ startTime: start, endTime: end, price: turf.pricePerHour, isAvailable: !isBooked });
    m += 30;
    if (m >= 60) { h++; m = 0; }
  }

  ApiResponse.success(res, { date, slots, operatingHours: turf.operatingHours });
});

exports.getTurfReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ turf: req.params.id, isVisible: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ turf: req.params.id, isVisible: true }),
  ]);

  ApiResponse.paginated(res, reviews, { page, limit, total, pages: Math.ceil(total / limit) });
});

exports.createTurf = asyncHandler(async (req, res) => {
  const data = { ...req.body, owner: req.user._id };

  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
    data.images = uploads.map((u) => u.secure_url);
    data.coverImage = data.images[0];
  }

  const turf = await Turf.create(data);
  ApiResponse.created(res, turf, 'Turf created successfully');
});

exports.updateTurf = asyncHandler(async (req, res) => {
  let turf = await Turf.findById(req.params.id);
  if (!turf) throw ApiError.notFound('Turf not found');

  if (req.user.role !== 'admin' && turf.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized to update this turf');
  }

  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
    const newImages = uploads.map((u) => u.secure_url);
    turf.images = [...(turf.images || []), ...newImages];
    if (!turf.coverImage) turf.coverImage = newImages[0];
  }

  Object.assign(turf, req.body);
  await turf.save();
  ApiResponse.success(res, turf, 'Turf updated successfully');
});

exports.deleteTurf = asyncHandler(async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) throw ApiError.notFound('Turf not found');

  if (req.user.role !== 'admin' && turf.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  turf.isActive = false;
  await turf.save();
  ApiResponse.noContent(res, 'Turf deactivated');
});
