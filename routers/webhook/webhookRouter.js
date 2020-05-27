const express = require("express");
const bot = require("../../bot.js");

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  await bot.insertMessage(req, res);
  await bot.createReply(req, res);
  bot.insertReply(req, res);
});

module.exports = webhookRouter;
