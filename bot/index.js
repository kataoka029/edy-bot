const { config, client } = require("../config");
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
  console.log("CONFIG - ", config);
  if (event.message.type === "image") {
    fetch(`https://api.line.me/v2/bot/message/${event.message.id}/content`, {
      Authorization: `Bearer ${config.channelAccessToken}`,
    }).then((res) => console.log("RES - ", res));
  }

  const replyObject = createReplyObject(events);
  client
    .replyMessage(event.replyToken, [replyObject])
    .then(() => console.log("SUCCESS - reply()"))
    .catch((err) => console.log("ERROR - reply() - ", err));
};

module.exports = { createReplyObject, reply };
