const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true, select: false },
    type: { type: String, enum: ['register', 'reset_password'], required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

otpSchema.methods.matchOtp = async function (entered) {
  return bcrypt.compare(entered, this.otp);
};

module.exports = mongoose.model('OTP', otpSchema);
