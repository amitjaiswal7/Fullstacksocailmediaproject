const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const User = require('../model/usermodel');
const router = express.Router();



router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Get suggested users with pagination, excluding current user
router.get('/suggested', async (req, res) => {
  const { page = 1, limit = 10, currentUserId } = req.query;

  try {
    const users = await User.find({ _id: { $ne: currentUserId } }) // Exclude current user
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('_id name bio profileImage followers');

    const total = await User.countDocuments({ _id: { $ne: currentUserId } });
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Follow a user
router.post('/follow/:id', async (req, res) => {
  const { userId } = req.body; // Current logged-in user ID
  const { id } = req.params; // User to follow

  if (userId === id) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }

  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(id);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.following.includes(id)) {
      user.following.push(id);
      userToFollow.followers.push(userId);

      await user.save();
      await userToFollow.save();

      res.status(200).json({ message: 'Successfully followed user' });
    } else {
      res.status(400).json({ message: 'Already following this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });
  }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId === id) {
    return res.status(400).json({ message: 'Cannot unfollow yourself' });
  }

  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(id);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(id)) {
      user.following = user.following.filter(followingId => followingId.toString() !== id);
      userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== userId);

      await user.save();
      await userToUnfollow.save();

      res.status(200).json({ message: 'Successfully unfollowed user' });
    } else {
      res.status(400).json({ message: 'Not following this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
});




module.exports = router;
