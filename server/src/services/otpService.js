const crypto = require('crypto');
const OTP = require('../models/OTP');
const { sendEmail, otpEmailTemplate } = require('./emailService');
const ApiError = require('../utils/ApiError');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const createAndSendOtp = async (email, type) => {
  const plainOtp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.deleteMany({ email, type });

  await OTP.create({ email, otp: plainOtp, type, expiresAt });

  const template = otpEmailTemplate(plainOtp, type);
  await sendEmail({ to: email, ...template });

  return { expiresIn: 600 };
};

const verifyOtp = async (email, type, enteredOtp) => {
  const record = await OTP.findOne({ email, type, verified: false }).select('+otp');
  if (!record) throw ApiError.badRequest('OTP expired or not found. Request a new one.');

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    throw ApiError.badRequest('OTP has expired. Request a new one.');
  }

  const isValid = await record.matchOtp(enteredOtp);
  if (!isValid) throw ApiError.badRequest('Invalid OTP');

  record.verified = true;
  await record.save();
  return true;
};

module.exports = { createAndSendOtp, verifyOtp };
