const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sport: { type: String, default: 'cricket', enum: ['cricket', 'football', 'badminton', 'multi-sport'] },
    location: {
      city: { type: String, required: true, index: true },
      area: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    pricePerHour: { type: Number, required: true, min: 0 },
    size: { type: String, default: 'Full Ground' },
    surface: { type: String, default: 'Turf' },
    amenities: [{ type: String }],
    facilities: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '23:00' },
    },
    defaultSlots: [slotSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

turfSchema.index({ 'location.city': 1, sport: 1, pricePerHour: 1, rating: -1 });
turfSchema.index({ name: 'text', 'location.area': 'text', 'location.city': 'text' });

turfSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Turf', turfSchema);
