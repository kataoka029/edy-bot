const fetch = require("node-fetch");
const _ = require("lodash");

const { client, url } = require("../config");
const { createReplyObject } = require("../bot");

const insertUserMessages = async (events) => {
  await fetch(`${url}api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(events),
  }).catch((err) => console.log("ERROR - insertUserMessages() - ", err));
};

const insertReplyMessage = async (events) => {
  const replyObject = createReplyObject(events);
  const replyEvents = _.cloneDeep(events);
  replyEvents[0].replyToken = "_";
  replyEvents[0].message.id = "_";
  replyEvents[0].message.type = replyObject.type;
  replyEvents[0].message.text = replyObject.text;

  await fetch(`${url}api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(replyEvents),
  }).catch((err) => console.log("ERROR - insertReplyMessage() - ", err));
};

const insertUser = async (events) => {
  const event = events[0];
  const profile = await client.getProfile(event.source.userId);

  await fetch(`${url}api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(profile),
  }).catch((err) => console.log("ERROR - insertUser() - ", err));
};

module.exports = { insertUserMessages, insertReplyMessage, insertUser };
