const cloudinary = require('../config/cloudinary');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function isConfigured() {
  return Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
}

// Streams an in-memory file buffer straight to Cloudinary — no temp file on
// disk. See middleware/upload.js for why multer uses memoryStorage here.
function uploadBuffer(buffer, folder) {
  if (!isConfigured()) {
    throw new ApiError(501, 'Image uploads are not configured yet. Set CLOUDINARY_* in backend/.env.');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err || !result) return reject(new ApiError(502, 'Image upload failed'));
      resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { isConfigured, uploadBuffer };
