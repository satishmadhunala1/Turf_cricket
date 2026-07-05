const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    invoiceNumber: { type: String, unique: true, sparse: true },
    notes: { type: String },
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

bookingSchema.index({ turf: 1, bookingDate: 1, startTime: 1 });
bookingSchema.index({ user: 1, status: 1 });

bookingSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.invoiceNumber = `TB-${Date.now().toString(36).toUpperCase()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
