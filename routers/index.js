const express = require("express");
const rootRouter = express.Router();

// API系のルーティング
rootRouter.use("/webhook", require("./webhook/index.js"));
rootRouter.use("/api", express.json());
rootRouter.use("/api/messages", require("./api/messages.js"));
rootRouter.use("/api/users", require("./api/users.js"));

// 表示系のルーティング
rootRouter.get("/", (req, res) => res.render("index.html"));

module.exports = rootRouter;
