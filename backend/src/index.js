// To connect with .env
require("dotenv").config();

// Express and Cors
const express = require("express");
const app = express();
const cors = require("cors");

// CORS setting
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/***** Routes *****/
// MyUser Route
const myUserRoute = require("./routes/userRoute.js");
app.use("/my/user", express.json(), myUserRoute);

// Users Route
const usersRoute = require("./routes/users.js");
app.use("/users", express.json(), usersRoute);

// Listing route
const listingRoute = require("./routes/listing.js");
app.use("/listing", express.json(), listingRoute);

// Booking route
const bookingRoute = require("./routes/bookingRoute.js");
app.use("/booking", bookingRoute);

// Message route
const messageRoute = require("./routes/messageRoute.js");
app.use("/message", express.json(), messageRoute);

// Chat route
const chatRoute = require("./routes/chatRoute.js");
app.use("/chat", express.json(), chatRoute);

// Review route
const reviewRoute = require("./routes/review.js");
app.use("/review", express.json(), reviewRoute);

/***** End Of Routes *****/

// Socket.IO connection handling
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("message", "Welcome!");

  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    io.emit("chat message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Port for server
const port = process.env.PORT || 4000;
// Dynamic API URL based on environment variable or default to localhost
const apiUrl = process.env.API_URL || `http://localhost:${port}`;
app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
  console.log(`API URL: ${apiUrl}`);
});

// Database Connection
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
  });
