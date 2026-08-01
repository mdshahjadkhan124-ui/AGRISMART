const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Files land in memory (not disk) and are streamed straight to Cloudinary
// by imageUpload.service.js — see PROGRESS.md for why multer-storage-
// cloudinary isn't used (it only supports the vulnerable Cloudinary v1 SDK).
const storage = multer.memoryStorage();

function imageFileFilter(_req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ApiError(400, 'Only image files are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
