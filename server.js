const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};

// ミドルウェアの設定
app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("", require("./routers/rootRouter.js"));
app.use("/api", express.json());

// socket.ioの設定
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// server.listen(PORT)すれば、app.listen(PORT)は不要そう
const PORT = process.env.PORT || 4000;
server.listen(PORT);
console.log(`Server running at ${PORT}`);

module.exports = io;
