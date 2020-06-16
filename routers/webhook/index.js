const express = require("express");
const bot = require("../../bot.js");

const webhookRouter = express.Router();
webhookRouter.post("/", bot.lineMiddleware, async (req, res) => {
  try {
    // console.log("ここまできてる？");
    const events = req.body.events;

    // DBへの追加、リプライ
    await bot.insertUserMessage(events);
    bot.reply(events);
    await bot.insertReply(events);

    // メッセージの受信をクライアントサイドに通知（ioは中でrequireする必要あり）
    const io = require("../../server.js");
    const event = events[0];
    io.emit("refetch", { event });
  } catch (err) {
    console.log(`ERROR in POST /webhook: ${err}`);
  }
});

module.exports = webhookRouter;
