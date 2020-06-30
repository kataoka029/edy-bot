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
    await insertUserMessage(events);
    reply(events);
    await insertReplyMessage(events);
  } else if (event.type === "follow") {
    await insertUser(events);
  }

  // ioはwebhookRouter.post()の中で
  const io = require("../../server.js");
  io.emit("refetch", { event });
});

module.exports = webhookRouter;
