const express = require("express");
const rootRouter = express.Router();

// API系のルーティング
rootRouter.use("/webhook", require("./webhook/webhookRouter.js"));
rootRouter.use("/api", express.json());
rootRouter.use("/api/messages", require("./api/messagesRouter.js"));
rootRouter.use("/api/users", require("./api/usersRouter.js"));

// 表示系のルーティング
rootRouter.get("/", (req, res) => res.render("index.html"));

module.exports = rootRouter;
