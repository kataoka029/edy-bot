// ボットの初期設定
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
dotenv.config();
const config = {
  channelSecret: process.env.SECRET_KEY,
  channelAccessToken: process.env.ACCESS_TOKEN,
};
const client = new line.Client(config);
const _ = require("lodash");
const bot = {};

// DBとのやりとりのための設定
const fetch = require("node-fetch");
const url = "https://c8bce5b3.ngrok.io/";

// 相手からのメッセージをDBに追加
bot.insertMessage = (req, res) => {
  const events = req.body.events;
  fetch(`${url}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(events),
  });
};

// リプライオブジェクトを作成
const createReplyMessage = (event) => {
  const text = event.message.text;
  return {
    type: "text",
    text: `「${text}」ですね。申し訳ないのですが、言葉の意味がよく分かりません😰なるべく早く担当からご連絡させていただきますので、少々お待ちください🙇‍♀️`,
  };
};

// 相手に返事（replyMessageを配列にすれば複数送信可能）
bot.createReply = async (req, res) => {
  const event = req.body.events[0];
  const replyMessage = createReplyMessage(event);
  await client.replyMessage(event.replyToken, replyMessage);
};

// こちらからのメッセージをDBに追加
bot.insertReply = (req, res) => {
  const events = req.body.events;
  const replyEvents = _.cloneDeep(events);
  const replyMessage = createReplyMessage(events[0]);
  replyEvents[0].replyToken = "_";
  replyEvents[0].source.userId = "_";
  replyEvents[0].source.type = "edy";
  replyEvents[0].message.id = "_";
  replyEvents[0].message.type = replyMessage.type;
  replyEvents[0].message.text = replyMessage.text;
  fetch(`${url}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(replyEvents),
  });
};

// bot.client = client;
bot.lineMiddleware = line.middleware(config);
module.exports = bot;
