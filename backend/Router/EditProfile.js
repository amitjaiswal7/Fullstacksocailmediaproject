const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/usermodel');
const router = express.Router();


// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fetch Current User Profile Data
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      profile: {
        name: user.name,
        pronouns: user.pronouns,
        bio: user.bio,
        gender: user.gender,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update User Profile
router.put('/:userId', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, pronouns, bio, gender } = req.body;

    // Prepare update data
    const updateData = { name, pronouns, bio, gender };

    // Handle profile image upload and resizing
    if (req.file) {
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize(150, 150) // Resize to 150x150 pixels
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

      // Save image to a directory (e.g., "uploads/")
      const imagePath = `uploads/${userId}-profile.jpeg`;
      const fs = require('fs');
      fs.writeFileSync(imagePath, resizedImageBuffer);

      // Update profileImage field
      updateData.profileImage = imagePath;
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
