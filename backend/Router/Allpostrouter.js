const express = require('express');
const Post = require('../model/PostModel');
const User = require('../model/PostModel');
const router = express.Router();
const mongoose = require('mongoose')
const Notification = require('../model/NotiFicaton');

const path = require('path');



// Middleware to serve images
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name profileImage')
      .populate('comments.userId', 'name profileImage');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like or Unlike a Post
router.post('/:postId/like', async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid user ID or post ID' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);

      // Create Notification
      if (post.userId.toString() !== userId) {
        const notification = new Notification({
          userId: post.userId,
          triggeredBy: userId,
          type: 'like',
          postId,
          message: 'liked your post.',
        });

        await notification.save(); // Save the notification explicitly
      }
    }

    await post.save();
    res.status(200).json({ message: 'Like status updated', likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Comment
router.post('/:postId/comment', async (req, res) => {
  const { userId, text } = req.body;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid user ID or post ID' });
  }

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text cannot be empty' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = { userId, text };
    post.comments.push(newComment);

    if (post.userId.toString() !== userId) {
      const notification = new Notification({
        userId: post.userId,
        triggeredBy: userId,
        type: 'comment',
        postId,
        message: 'commented on your post.',
      });

      await notification.save(); // Save the notification explicitly
    }

    await post.save();
    res.status(200).json({ message: 'Comment added', comments: post.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Notifications
router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log('Invalid user ID:', userId);
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    console.log('Finding notifications for userId:', userId);

    // Query notifications where `userId` matches the request
    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('triggeredBy', 'name profileImage') // Populate the user who triggered the notification
      .populate('postId', 'image') // Populate post details
      .sort({ createdAt: -1 });

    console.log('Fetched Notifications:', notifications);
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: err.message });
  }
});









// Mark Notification as Read
router.patch('/notifications/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).json({ message: 'Invalid notification ID' });
  }

  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
