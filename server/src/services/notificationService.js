const Notification = require('../models/Notification');
const { sendEmail, bookingConfirmationTemplate } = require('./emailService');

const createNotification = async ({ userId, type, title, message, data = {} }) => {
  return Notification.create({ user: userId, type, title, message, data });
};

const notifyBookingConfirmed = async (user, booking, turf) => {
  await createNotification({
    userId: user._id,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: `Your booking at ${turf.name} is confirmed for ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}.`,
    data: { bookingId: booking._id },
  });

  const template = bookingConfirmationTemplate(booking, turf);
  await sendEmail({ to: user.email, ...template });
};

const notifyBookingCancelled = async (user, booking, turf) => {
  await createNotification({
    userId: user._id,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `Your booking at ${turf.name} has been cancelled.`,
    data: { bookingId: booking._id },
  });
};

const notifyPaymentSuccess = async (user, amount, bookingId) => {
  await createNotification({
    userId: user._id,
    type: 'payment_success',
    title: 'Payment Successful',
    message: `Payment of ₹${amount} received successfully.`,
    data: { bookingId },
  });
};

module.exports = {
  createNotification,
  notifyBookingConfirmed,
  notifyBookingCancelled,
  notifyPaymentSuccess,
};
