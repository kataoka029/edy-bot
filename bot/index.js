const { client } = require("../config");

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

module.exports = { createReplyObject, reply };
