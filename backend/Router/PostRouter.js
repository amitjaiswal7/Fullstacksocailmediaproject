const express = require('express');
const multer = require('multer');
const Post = require('../model/PostModel');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Create Post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, text } = req.body;
    const image = req.file.path;

    const post = new Post({ userId, text, image });
    await post.save();
    res.json({ success: true, message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
