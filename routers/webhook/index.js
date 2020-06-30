const express = require("express");
// const bot = require("../../bot.js");
const { lineMiddleware } = require("../../config");
const {
  insertUserMessage,
  insertReplyMessage,
  insertUser,
} = require("../../db");
const { reply } = require("../../bot");

const webhookRouter = express.Router();
webhookRouter.post("/", lineMiddleware, async (req, res) => {
  const events = req.body.events;
  const event = events[0];

  // const event = events[0];
  console.log("EVENT - ", event);

  if (event.type === "message") {
    // DBへの追加、リプライ
    await insertUserMessage(events);
    reply(events);
    await insertReplyMessage(events);

    // ioはifの中で
    const io = require("../../server.js");
    io.emit("refetch", { event });
  } else if (event.type === "follow") {
    await insertUser(events);
    // ioはifの中で
    const io = require("../../server.js");
    io.emit("refetch", { event });
  }
});

module.exports = webhookRouter;
