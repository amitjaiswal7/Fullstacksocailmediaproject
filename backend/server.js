const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./Router/Auth');
const postRoutes = require('./Router/PostRouter');
const profileRoutes = require('./Router/Profile');
const editProfileRoutes = require('./Router/EditProfile');
const allPostRoutes = require('./Router/Allpostrouter');
const suggestUserRoutes = require('./Router/SurgestUser');
const chatRoutes = require('./Router/ChatRouter');
const userRoutes = require('./Router/ChatUser');
const User = require('./model/usermodel');
const Chat = require('./model/Chatuser'); // Ensure correct file path
const storyRoutes = require('./Router/UserStoryrouter')
const AllUserProfile = require('./Router/AllProfileuserRouter')
const Search = require('./Router/SearchRouter')
// Initialize app and server




const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., profile images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/edit-profile', editProfileRoutes);
app.use('/api/allposts', allPostRoutes);
app.use('/api', suggestUserRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use("/api/stories", storyRoutes);
app.use('/api/alluser', AllUserProfile);
app.use('/api/frent', Search);
// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Socket.IO logic
// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    const { sender, receiver, message } = data;

    try {
      // Save message to MongoDB
      const newMessage = new Chat({
        sender,
        receiver,
        message,
      });

      const savedMessage = await newMessage.save();
      console.log('Message saved:', savedMessage);

      // Emit message to receiver's room
      io.to(receiver).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);

      // Notify sender of the error
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
