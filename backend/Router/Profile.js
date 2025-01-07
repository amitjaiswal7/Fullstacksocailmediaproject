
const express = require('express');
const multer = require('multer');

const User = require('../model/usermodel');
const Post = require('../model/PostModel');
const router = express.Router();
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Serve static uploads
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get Profile Data
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('followers', 'name')
      .populate('following', 'name')
      .lean();

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

     const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    const profileImage = user.profileImage ? `${req.protocol}://${req.get('host')}/${user.profileImage}` : null;

    res.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        pronouns: user.pronouns,
        bio: user.bio,
        gender: user.gender,
        profileImage,
        followers: user.followers.length,
        following: user.following.length,
        posts: posts.length,
        postsData: posts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




module.exports = router;