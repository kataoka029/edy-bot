const express = require("express");
const bot = require("../../bot.js");

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  bot.insertUserMessage(req, res);
  await bot.reply(req, res);
  bot.insertReply(req, res);
});

module.exports = webhookRouter;
