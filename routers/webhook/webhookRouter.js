const express = require("express");
const bot = require("../../bot.js");

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  try {
    // DBへの追加、リプライ（ioは中でrequireする必要あり）
    bot.insertUserMessage(req, res);
    await bot.reply(req, res);
    bot.insertReply(req, res);

    // メッセージの受信をクライアントサイドに通知
    const io = require("../../server.js");
    const event = req.body.events[0];
    io.emit("refetch", { event });
  } catch (err) {
    console.error(`ERROR in POST /webhook: ${err}`);
  }
});

module.exports = webhookRouter;
