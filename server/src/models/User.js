const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
    googleId: { type: String, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turf' }],
    wallet: { type: Number, default: 0, min: 0 },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    wallet: this.wallet,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
