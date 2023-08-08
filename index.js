const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const { Server } = require("socket.io");
const dotenv = require('dotenv').config();
const chatService = require('./services/chat-service');

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoUrl = process.env.DATABASE_URL
mongoose.connect(mongoUrl);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

app.use('/api', routes)

let onlineUsers = [];
io.on('connection', (socket) => {
  socket.join(socket.id);

  socket.on("join", ({ roomName, userId }) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {  // if user is not added before
      onlineUsers.push({ userId: userId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
      io.emit("get-users", onlineUsers);
    }
    socket.join(roomName);
  })
  // send all active users to new user

  socket.on('message', (message) => {
    socket.broadcast.to(message.roomName).emit('message', message);
    chatService.createChat(message);
  })


  socket.on('disconnect', () => {
    console.log('user disconnected')
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});