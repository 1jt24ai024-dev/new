const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const auth = require('../middleware/auth');

const router = express.Router();
const defaultUpload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });
const bannerUpload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/', auth, (req, res, next) => {
  const upload = req.query.type === 'banner' ? bannerUpload : defaultUpload;
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'Image upload failed' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path, publicId: req.file.filename });
  });
});

module.exports = router;
