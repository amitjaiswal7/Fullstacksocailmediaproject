const express = require('express');
const User = require('../model/usermodel');
const Chat = require('../model/Chatuser');

const router = express.Router();






// Fetch messages between two users
router.get('/', async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const chat = new Chat({ sender, receiver, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = router;
