const express = require("express");
const multer = require("multer");
const path = require("path");
const Story = require("../model/usermodel");
const User = require("../model/usermodel");
const mongoose = require("mongoose");

const router = express.Router();

// Multer setup for file uploads
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

// Route 1: Get current user's stories
router.get("/my-stories", async (req, res) => {
  const { userId } = req.query;

  if (!validateObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const stories = await Story.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage");
    res.json({ stories });
  } catch (error) {
    console.error("Error fetching user's stories:", error);
    res.status(500).json({ message: "Error fetching user's stories.", error });
  }
});

// Route 2: Get other users' stories
router.get("/", async (req, res) => {
  const { userId } = req.query;

  try {
    const stories = await Story.find({ user: { $ne: userId } })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });
    res.json({ stories });
  } catch (error) {
    console.error("Error fetching other users' stories:", error);
    res.status(500).json({ message: "Error fetching other users' stories.", error });
  }
});

// Route 3: Mark story as viewed
router.post("/:id/view", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!validateObjectId(id) || !validateObjectId(userId)) {
    return res.status(400).json({ message: "Invalid story ID or user ID" });
  }

  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

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

// Route 4: Create a story
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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    await story.save();
    res.status(201).json({ message: "Story created successfully!", story });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Error creating story.", error });
  }
});

// Route 5: Delete expired stories (Cron job or manual trigger)
router.delete("/expired", async (req, res) => {
  try {
    const result = await Story.deleteMany({ expiresAt: { $lte: new Date() } });
    res.json({ message: "Expired stories deleted.", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting expired stories:", error);
    res.status(500).json({ message: "Error deleting expired stories.", error });
  }
});

// Route 6: Delete a specific story
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid story ID" });
  }

  try {
    const result = await Story.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json({ message: "Story deleted successfully." });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Error deleting story.", error });
  }
});

module.exports = router;
