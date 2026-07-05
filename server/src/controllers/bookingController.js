const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { getProvider } = require('../services/payment/paymentService');
const { notifyBookingConfirmed, notifyBookingCancelled } = require('../services/notificationService');
const { clientUrl } = require('../config/env');

const parseTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const calcDuration = (start, end) => (parseTime(end) - parseTime(start)) / 60;

const hasOverlap = (start1, end1, start2, end2) =>
  parseTime(start1) < parseTime(end2) && parseTime(end1) > parseTime(start2);

exports.createBooking = asyncHandler(async (req, res) => {
  const { turfId, bookingDate, startTime, endTime, paymentMethod = 'stripe', notes } = req.body;

  const turf = await Turf.findById(turfId);
  if (!turf || !turf.isActive) throw ApiError.notFound('Turf not found');

  const duration = calcDuration(startTime, endTime);
  if (duration <= 0) throw ApiError.badRequest('End time must be after start time');

  const date = new Date(bookingDate);
  date.setHours(0, 0, 0, 0);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const existing = await Booking.find({
    turf: turfId,
    bookingDate: { $gte: date, $lt: nextDay },
    status: { $in: ['pending', 'confirmed'] },
  });

  const conflict = existing.find((b) => hasOverlap(startTime, endTime, b.startTime, b.endTime));
  if (conflict) throw ApiError.conflict('This time slot is already booked');

  const totalAmount = duration * turf.pricePerHour;

  const booking = await Booking.create({
    user: req.user._id,
    turf: turfId,
    bookingDate: date,
    startTime,
    endTime,
    duration,
    totalAmount,
    notes,
    status: paymentMethod === 'cash' ? 'pending' : 'pending',
  });

  const payment = await Payment.create({
    user: req.user._id,
    booking: booking._id,
    amount: totalAmount,
    method: paymentMethod,
    provider: paymentMethod,
    status: 'pending',
  });

  booking.payment = payment._id;
  await booking.save();

  let paymentData = null;
  if (paymentMethod !== 'cash') {
    const provider = getProvider(paymentMethod);
    paymentData = await provider.createPaymentIntent({
      amount: totalAmount,
      metadata: {
        bookingId: booking._id.toString(),
        turfId: turfId.toString(),
        userId: req.user._id.toString(),
        description: `${turf.name} — ${startTime} to ${endTime}`,
      },
      successUrl: `${clientUrl}/booking/success?bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${clientUrl}/booking/cancel?bookingId=${booking._id}`,
    });
  }

  ApiResponse.created(res, { booking, payment: paymentData }, 'Booking created');
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const { status, upcoming } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (upcoming === 'true') {
    filter.bookingDate = { $gte: new Date() };
    filter.status = { $in: ['pending', 'confirmed'] };
  }

  const bookings = await Booking.find(filter)
    .populate('turf', 'name coverImage location pricePerHour slug')
    .populate('payment')
    .sort('-bookingDate');

  ApiResponse.success(res, bookings);
});

exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('turf')
    .populate('payment')
    .populate('user', 'name email phone');

  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
    throw ApiError.forbidden('Not authorized');
  }

  ApiResponse.success(res, booking);
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('turf');
  if (!booking) throw ApiError.notFound('Booking not found');

  if (booking.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
    throw ApiError.forbidden('Not authorized');
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw ApiError.badRequest('Booking cannot be cancelled');
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancelReason = req.body.reason || 'Cancelled by user';
  await booking.save();

  await notifyBookingCancelled(req.user, booking, booking.turf);
  ApiResponse.success(res, booking, 'Booking cancelled');
});

exports.confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, sessionId, method = 'stripe' } = req.body;

  const booking = await Booking.findById(bookingId).populate('turf');
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.user.toString() !== req.user._id.toString()) throw ApiError.forbidden();

  const provider = getProvider(method);
  const result = await provider.verifyPayment(sessionId);

  if (!result.paid) throw ApiError.badRequest('Payment not completed');

  const payment = await Payment.findById(booking.payment);
  payment.status = 'completed';
  payment.transactionId = result.transactionId;
  await payment.save();

  booking.status = 'confirmed';
  await booking.save();

  const user = req.user;
  await notifyBookingConfirmed(user, booking, booking.turf);

  ApiResponse.success(res, { booking, payment }, 'Payment confirmed');
});

exports.getInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('turf', 'name location')
    .populate('user', 'name email phone')
    .populate('payment');

  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
    throw ApiError.forbidden();
  }

  ApiResponse.success(res, {
    invoiceNumber: booking.invoiceNumber,
    booking,
    issuedAt: booking.createdAt,
  });
});
