require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const sessionRoutes = require('./routes/session');
const socketHandler = require('./socket');  

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: "*" }
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_HOST;

app.use(cors());
app.use(express.json());
app.use('/', sessionRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });

socketHandler(io);
