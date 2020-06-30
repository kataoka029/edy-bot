const express = require("express");
// const bot = require("../../bot.js");
const { lineMiddleware } = require("../../config");
const { insertUserMessage, insertReply } = require("../../db");
const { reply } = require("../../bot");

const webhookRouter = express.Router();
webhookRouter.post("/", lineMiddleware, async (req, res) => {
  console.log("Webhook is comming!");
  const events = req.body.events;

  // DBへの追加、リプライ
  await insertUserMessage(events);
  reply(events);
  await insertReply(events);

  // メッセージの受信をクライアントサイドに通知（ioは中でrequireする必要あり）
  const io = require("../../server.js");
  const event = events[0];
  io.emit("refetch", { event });
});

module.exports = webhookRouter;
