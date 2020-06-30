const fetch = require("node-fetch");
const { url } = require("../config");
const { createReply } = require("../bot");
const _ = require("lodash");

const insertUserMessage = async (events) => {
  await fetch(`${url}api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(events),
  })
    .then(() => console.log("SUCCESS - insertUserMessage()"))
    .catch((err) => console.log("ERROR - insertUserMessage() - ", err));
};

const insertReply = async (events) => {
  const replyObject = createReply(events);
  const replyEvents = _.cloneDeep(events);
  replyEvents[0].replyToken = "_";
  replyEvents[0].source.type = "edy";
  replyEvents[0].message.id = "_";
  replyEvents[0].message.type = replyObject.type;
  replyEvents[0].message.text = replyObject.text;
  await fetch(`${url}api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(replyEvents),
  })
    .then(() => console.log("SUCCESS - insertReply()"))
    .catch((err) => console.log("ERROR - insertReply() - ", err));
};

module.exports = { insertUserMessage, insertReply };
