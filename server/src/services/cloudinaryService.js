const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const uploadToCloudinary = (fileBuffer, folder = 'turfs') =>
  new Promise((resolve, reject) => {
    if (!cloudinary.config().cloud_name) {
      return reject(ApiError.badRequest('Cloudinary is not configured'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: `turfbook/${folder}`, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !cloudinary.config().cloud_name) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
