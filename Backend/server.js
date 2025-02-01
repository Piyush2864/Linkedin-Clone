const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./db/config.js');

// Import Routes
const authRoute = require('./routes/authRoute.js');
const profileRoute = require('./routes/profileRoute.js');
const connectionRoute = require('./routes/connectionRoute.js');
const postRoute = require('./routes/postRoute.js');
const likeRoute = require('./routes/likeRoute.js');
const commentRoute = require('./routes/commentRoute.js');
const notificationRoute = require('./routes/notificationRoute.js');
const searchRoute = require('./routes/searchRoute.js');
const jobRoute = require('./routes/jobRoute.js');
const jobRecommendationRoute = require('./routes/jobRecommendationRoute.js');
const savedJobRoute = require('./routes/savedjobRoute.js');
const applicationRoute = require('./routes/applicationRoute.js');
const messageRoute = require('./routes/messageRoute.js');
const groupRoute = require('./routes/groupRoute.js');
const groupMessageRoute = require('./routes/groupMessageRoute.js');
const endoresmentRoute = require('./routes/endoresmentRoute.js');

dotenv.config();

const app = express();
const server = http.createServer(app); 

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize Socket.IO and export it globally
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

global.io = io; // ⚡ Set socket instance globally

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/connection', connectionRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/like', likeRoute);
app.use('/api/v1/comment', commentRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/search', searchRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/jobRecommendation', jobRecommendationRoute);
app.use('/api/v1/savedJob', savedJobRoute);
app.use('/api/v1/endoresment', endoresmentRoute);
app.use('/api/v1/application', applicationRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/group', groupRoute);
app.use('/api/v1/groupMessage', groupMessageRoute);

app.get('/', (req, res) => {
    console.log("Hello World");
    res.send("Server is running...");
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('user_online', (userId) => {
        console.log(`User ${userId} is online`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`);
});

module.exports = { app, io }; // Export io for usage in controllers

