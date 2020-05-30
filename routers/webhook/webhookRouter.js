const express = require("express");
const bot = require("../../bot.js");

const io = require("../../server");
// const socket = io();

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  try {
    bot.insertUserMessage(req, res);
    await bot.reply(req, res);
    bot.insertReply(req, res);
  } catch (err) {
    console.error(`ERROR in POST /webhook: ${err}`);
  }

  // ここで何かをemit？
});

module.exports = webhookRouter;
