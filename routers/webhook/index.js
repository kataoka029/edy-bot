const express = require("express");
// const bot = require("../../bot.js");
const { lineMiddleware } = require("../../config");
const { insertUserMessage, insertReply } = require("../../db");
const { reply } = require("../../bot");

const webhookRouter = express.Router();
webhookRouter.post("/", lineMiddleware, async (req, res) => {
  const events = req.body.events;
  const event = events[0];

  if (event.type === "message") {
    console.log("MESSAGE!", event);
    // DBへの追加、リプライ
    await insertUserMessage(events);
    reply(events);
    await insertReply(events);

    // メッセージの受信をクライアントサイドに通知（ioは中でrequireする必要あり）
    const io = require("../../server.js");
    const event = events[0];
    io.emit("refetch", { event });
  } else if (event.type === "follow") {
    console.log("FOLLOW!", event);
  } else {
    console.log(`${event.type.toUpperCase()} is not defined yet.`);
  }
});

module.exports = webhookRouter;
