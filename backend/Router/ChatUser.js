const express = require('express');
const User = require('../model/usermodel'); // Ensure this model exists

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name profileImage isOnline'); // Adjust fields as needed
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

module.exports = router;
