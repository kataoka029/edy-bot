const fetch = require("node-fetch");
const dropboxV2Api = require("dropbox-v2-api");

const { config, client, url, dropboxAccessToken } = require("../config");
const { createReplyText } = require("./logic");

const dropbox = dropboxV2Api.authenticate({
  token: dropboxAccessToken,
});

// const createReplyText = (text) => {
//   return text.match(/営業時間|営業.*何時/)
//     ? "「営業時間」ですね。\n当店は24時間年中無休で営業しております。"
//     : text.match(/場所.*分から/)
//     ? "「店舗の場所」ですね。\nGoogle Mapのリンクを共有いたします。\nhttps://goo.gl/maps/MDC5eEHL2AKamBfPA"
//     : "よく分かりません。";
// };

const createReplyObject = (events) => {
  const text = events[0].message.text;
  return {
    type: "text",
    text: createReplyText(text),
  };
};

const reply = async (events) => {
  const event = events[0];
  const replyObject = createReplyObject(events);
  client
    .replyMessage(event.replyToken, [replyObject])
    .catch((err) => console.log("ERROR - reply() - ", err));
};

const uploadImages = async (events) => {
  const response = await fetch(`${url}api/users/${events[0].source.userId}`);
  const user = await response.json();

  for (const event of events) {
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2) +
      ("00" + date.getMilliseconds()).slice(-3);
    const imagePath = `/edy-images/${user.id}/${timestamp}.jpg`;

    await fetch(
      `https://api-data.line.me/v2/bot/message/${event.message.id}/content`,
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    ).then((response) => {
      response.body.pipe(
        dropbox({
          resource: "files/upload",
          parameters: { path: imagePath },
        })
      );
    });

    fetch(`${url}api/messages/${event.message.id}/path`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePath }),
    }).catch((err) => console.log("ERROR - uploadImages() - ", err));
  }
};

module.exports = { createReplyObject, reply, uploadImages };
