const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: {
      type: String,
      enum: ['stripe', 'razorpay', 'phonepe', 'cash', 'wallet'],
      required: true,
    },
    provider: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: { type: String },
    providerResponse: { type: mongoose.Schema.Types.Mixed },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
