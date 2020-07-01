const express = require("express");
// const bot = require("../../bot.js");
const { lineMiddleware } = require("../../config");
const {
  insertUserMessage,
  insertReplyMessage,
  insertUser,
} = require("../../db");
const { reply, storeImage } = require("../../bot");

const webhookRouter = express.Router();
webhookRouter.post("/", lineMiddleware, async (req, res) => {
  const events = req.body.events;
  const event = events[0];
  // webhookRouter.post()の中でないといけない
  const io = require("../../server.js");

  console.log("EVENT - ", event);

  switch (event.type) {
    case "message":
      switch (event.message.type) {
        case "text":
          await insertUserMessage(events);
          reply(events);
          await insertReplyMessage(events);
          io.emit("refetch", { event });
          break;
        case "image":
          storeImage(events);
          console.log("image might be stored.");
          io.emit("refetch", { event });
          break;
        default:
          console.log("other message type dayo.");
      }
      break;
    case "follow":
      await insertUser(events);
      io.emit("refetch", { event });
      break;
    default:
      console.log("other type dayo.");
  }

  res.status(200).send();
});

module.exports = webhookRouter;
