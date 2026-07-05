const cloudinary = require('cloudinary').v2;
const { cloudinary: config } = require('./env');

if (config.cloudName && config.apiKey && config.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });
}

module.exports = cloudinary;
