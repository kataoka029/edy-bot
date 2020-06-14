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
const url =
  process.env.NODE_ENV === "production"
    ? "https://edy-api.herokuapp.com/"
    : "http://localhost:4000/";

// ユーザーメッセージをDBに追加
bot.insertUserMessage = async (events) => {
  try {
    // const events = req.body.events;
    await fetch(`${url}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(events),
    });
    console.log("bot.insertUserMessage() is DONE!");
  } catch (err) {
    console.error(`ERROR in bot.insertUserMessage(): ${err}`);
  }
};

// リプライオブジェクトを作成
const createReply = (events) => {
  const text = events[0].message.text;
  return {
    type: "text",
    text: `「${text}」ですね。申し訳ないのですが、言葉の意味がよく分かりません😰なるべく早く担当からご連絡させていただきますので、少々お待ちください🙇‍♀️`,
  };
};

// リプライ（replyObjectを配列にすれば複数送信可能）
bot.reply = async (events) => {
  try {
    const event = events[0];
    const replyObject = createReply(events);
    client.replyMessage(event.replyToken, [replyObject]);
  } catch (err) {
    console.error(`ERROR in bot.reply(): ${err}`);
  }
};

// リプライメッセージをDBに追加
bot.insertReply = async (events) => {
  try {
    const replyObject = createReply(events);
    const replyEvents = _.cloneDeep(events);
    replyEvents[0].replyToken = "_";
    // replyEvents[0].source.userId = "_";
    replyEvents[0].source.type = "edy";
    replyEvents[0].message.id = "_";
    replyEvents[0].message.type = replyObject.type;
    replyEvents[0].message.text = replyObject.text;
    await fetch(`${url}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(replyEvents),
    }).then(() => console.log("bot.insertReply() is DONE!"));
  } catch (err) {
    console.error(`ERROR in bot.insertReply(): ${err}`);
  }
};

// bot.client = client;
bot.lineMiddleware = line.middleware(config);
module.exports = bot;
