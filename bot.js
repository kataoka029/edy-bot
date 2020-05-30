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
const url = "https://ccee4f3076b5.ngrok.io/";

// ユーザーメッセージをDBに追加
bot.insertUserMessage = (req, res) => {
  try {
    const events = req.body.events;
    fetch(`${url}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(events),
    });
  } catch (err) {
    console.error(`ERROR in bot.insertUserMessage(): ${err}`);
  }
};

// リプライオブジェクトを作成
const createReply = (event) => {
  const text = event.message.text;
  return {
    type: "text",
    text: `「${text}」ですね。申し訳ないのですが、言葉の意味がよく分かりません😰なるべく早く担当からご連絡させていただきますので、少々お待ちください🙇‍♀️`,
  };
};

// リプライ（replyMessageを配列にすれば複数送信可能）
bot.reply = async (req, res) => {
  try {
    const events = req.body.events;
    const event = events[0];
    const replyObject = createReply(event);
    await client.replyMessage(event.replyToken, replyObject);
  } catch (err) {
    console.error(`ERROR in bot.reply(): ${err}`);
  }
};

// リプライメッセージをDBに追加
bot.insertReply = async (req, res) => {
  try {
    const events = req.body.events;
    const event = events[0];
    const replyObject = createReply(event);
    const replyEvents = _.cloneDeep(events);
    replyEvents[0].replyToken = "_";
    replyEvents[0].source.userId = "_";
    replyEvents[0].source.type = "edy";
    replyEvents[0].message.id = "_";
    replyEvents[0].message.type = replyObject.type;
    replyEvents[0].message.text = replyObject.text;
    fetch(`${url}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(replyEvents),
    });
  } catch (err) {
    console.error(`ERROR in bot.insertReply(): ${err}`);
  }
};

// bot.client = client;
bot.lineMiddleware = line.middleware(config);
module.exports = bot;
