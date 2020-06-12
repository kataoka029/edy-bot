const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://edy-manager.herokuapp.com/",
  ],
  credentials: true,
};

// ミドルウェアの設定
app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("", require("./routers/index.js"));
app.use("/api", express.json());

// socket.ioの設定
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
io.on("connection", (socket) => {
  console.log(`User connected at ${new Date().toLocaleString("ja")}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected at ${new Date().toLocaleString("ja")}`);
  });
});

// server.listen(PORT)すれば、app.listen(PORT)は不要そう
const PORT = process.env.PORT || 4000;
server.listen(PORT);
console.log(`Server running at ${PORT}`);

module.exports = io;
