const express = require("express");
const { lineMiddleware } = require("../../config");
const {
  insertUserMessages,
  insertReplyMessage,
  insertUser,
} = require("../../db");
const { reply, uploadImages } = require("../../bot");

const webhookRouter = express.Router();
webhookRouter.post("/", lineMiddleware, async (req, res) => {
  const events = req.body.events;
  const event = events[0];
  const io = require("../../server.js");

  events.forEach((event, i) => {
    console.log(`EVENT ${i + 1} - `, event);
  });
  switch (event.type) {
    case "message":
      await insertUserMessages(events);
      switch (event.message.type) {
        case "text":
          reply(events);
          await insertReplyMessage(events);
          break;
        case "image":
          await uploadImages(events);
          break;
        case "sticker":
          break;
      }
      io.emit("refetch", { event });
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
