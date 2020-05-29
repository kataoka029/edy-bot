const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("", require("./routers/rootRouter.js"));
app.use("/api", express.json());

// SOCKET.IO TEST
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// SOCKET.IO TEST

const PORT = process.env.PORT || 4000;
// server.listen(PORT)で繋がる、aoo.listen(PORT)はいらなそ)
server.listen(PORT);
console.log(`Server running at ${PORT}`);
