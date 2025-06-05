const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectMongo = require('./config/db');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectMongo();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS configuration for frontend domains
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://kurakani-frontend.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ API Routes
app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send("Running Successfully...");
});

// ✅ Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// ✅ Start Express Server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ✅ SOCKET.IO Integration
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173",
      "https://kurakani-frontend.onrender.com"
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New socket connection");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // Save for disconnection cleanup
    socket.emit("connected");
  });

  socket.on("join chat", (chatRoomId) => {
    socket.join(chatRoomId);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.off("setup", () => {
    socket.leave(socket.userId);
  });
});
