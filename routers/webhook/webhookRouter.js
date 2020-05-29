const express = require("express");
const bot = require("../../bot.js");

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  await bot.insertMessageFromUser(req, res);
  await bot.replyToUser(req, res);
  bot.insertMessageToUser(req, res);
});

module.exports = webhookRouter;
