const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://edy-manager.herokuapp.com",
    "https://edy-reservation.herokuapp.com",
  ],
  credentials: true,
};

app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("", require("./routers/index.js"));
app.use("/api", express.json());

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

io.on("connection", (socket) => {
  console.log(`User connected at ${new Date().toLocaleString("ja")}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected at ${new Date().toLocaleString("ja")}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT);
console.log(`Server running at ${PORT}`);

module.exports = io;
