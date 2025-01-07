const express = require("express");
const multer = require("multer");
const User = require("../model/usermodel");
const Post = require("../model/PostModel");
const router = express.Router();
const path = require("path");

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const getProfileImageUrl = (req, imagePath) =>
  imagePath ? `${req.protocol}://${req.get("host")}/${imagePath}` : null;

// ======================== API Routes ======================== //

// 1. Fetch user profile by ID
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("followers", "name")
      .populate("following", "name")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    const profile = {
      name: user.name,
      email: user.email,
      pronouns: user.pronouns,
      bio: user.bio,
      gender: user.gender,
      profileImage: getProfileImageUrl(req, user.profileImage),
      followers: user.followers.length,
      following: user.following.length,
      posts: posts.length,
      postsData: posts.map((post) => ({
        _id: post._id,
        text: post.text,
        image: post.image,
        createdAt: post.createdAt,
      })),
    };

    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Follow a user



// Follow a user












// 4. Update profile data
router.put("/profile/:userId", upload.single("profileImage"), async (req, res) => {
  const { userId } = req.params;
  const updateData = {
    name: req.body.name,
    pronouns: req.body.pronouns,
    bio: req.body.bio,
    gender: req.body.gender,
  };

  if (req.file) {
    updateData.profileImage = req.file.path;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Fetch all users (for testing or admin usage)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("name email bio gender profileImage").lean();

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
