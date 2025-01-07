const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const Story = require("../model/Storyuser");
const User = require("../model/usermodel");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Helper function to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get current user's stories
router.get("/my-stories", async (req, res) => {
  const { userId } = req.query;

  if (!validateObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const stories = await Story.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ stories });
  } catch (error) {
    console.error("Error fetching user's stories:", error);
    res.status(500).json({ message: "Error fetching user's stories.", error });
  }
});

// Get other users' stories
router.get("/", async (req, res) => {
  const { userId } = req.query;

  try {
    const stories = await Story.find({ user: { $ne: userId } })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ stories });
  } catch (error) {
    console.error("Error fetching other users' stories:", error);
    res.status(500).json({ message: "Error fetching other users' stories.", error });
  }
});

// Mark story as viewed
router.post("/:id/view", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!validateObjectId(id) || !validateObjectId(userId)) {
    return res.status(400).json({ message: "Invalid story ID or user ID" });
  }

  try {
    const story = await Story.findById(id);
    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }
    res.json({ message: "Story marked as viewed." });
  } catch (error) {
    console.error("Error marking story as viewed:", error);
    res.status(500).json({ message: "Error marking story as viewed.", error });
  }
});

// Create a story
router.post("/", upload.fields([{ name: "video" }, { name: "image" }]), async (req, res) => {
  const { userId, text } = req.body;

  if (!validateObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const story = new Story({
      user: userId,
      text,
      video: req.files?.video ? `/uploads/${req.files.video[0].filename}` : null,
      image: req.files?.image ? `/uploads/${req.files.image[0].filename}` : null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await story.save();
    res.status(201).json({ message: "Story created successfully!", story });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Error creating story.", error });
  }
});

module.exports = router;
