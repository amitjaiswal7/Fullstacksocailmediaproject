// server.js or routes/userRoutes.js
const express = require('express');
const User = require('../model/usermodel'); // Assuming your user model is in the models directory

const router = express.Router();

// Search user by name
router.get('/search', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const user = await User.findOne({ name: username }).select('name bio profileImage');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
