const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ turf: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
