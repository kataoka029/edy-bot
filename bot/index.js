const { client, url } = require("../config");
const fs = require("fs");
// const path = require("path");
const fetch = require("node-fetch");

const createReplyObject = (events) => {
  const text = events[0].message.text;
  return {
    type: "text",
    text: `「${text}」ですね。申し訳ないのですが、言葉の意味がよく分かりません😰なるべく早く担当からご連絡させていただきますので、少々お待ちください🙇‍♀️`,
  };
};

const reply = async (events) => {
  const event = events[0];
  const replyObject = createReplyObject(events);
  client
    .replyMessage(event.replyToken, [replyObject])
    .then(() => console.log("SUCCESS - reply()"))
    .catch((err) => console.log("ERROR - reply() - ", err));
};

const storeImage = async (events) => {
  const event = events[0];
  const res = await fetch(`${url}api/users/${event.source.userId}`);
  const users = await res.json();
  const userId = users[0].id;
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2) +
    ("00" + date.getMilliseconds()).slice(-3);

  // pathの指定がうまくいかないのでとりあえず絶対パスでローカルフォルダを指定
  // const dest = fs.createWriteStream(
  //   path.resolve(__dirname, "../img", `${userId}_${timestamp}.jpg`),
  //   "binary"
  // );
  const dest = fs.createWriteStream(
    `/Users/Shun/Coding/edy-bot/img/${userId}_${timestamp}.jpg`,
    "binary"
  );

  client.getMessageContent(event.message.id).then((stream) => {
    stream.pipe(dest);
  });
};

module.exports = { createReplyObject, reply, storeImage };
