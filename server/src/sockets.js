// sockets.js
const { Server } = require("socket.io");

const connectSockets = (server, FRONTEND_URL) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (data) => {
      // Broadcast the message to all connected clients
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = { connectSockets };
