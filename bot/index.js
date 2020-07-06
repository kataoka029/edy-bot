const { config, client, url, dropboxAccessToken } = require("../config");
const fs = require("fs");
const fetch = require("node-fetch");
const dropboxV2Api = require("dropbox-v2-api");

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

const dropbox = dropboxV2Api.authenticate({
  token: dropboxAccessToken,
});

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

  // const downloadStream = dropbox({
  //   resource: "files/download",
  //   parameters: { path: "/edy-images/sample.jpg" },
  // });

  const uploadStream = dropbox(
    {
      resource: "files/upload",
      parameters: { path: `/edy-images/${userId}_${timestamp}.jpg` },
    },
    (err, result, response) => {
      console.log("UPLOADED ON DROPBOX??");
    }
  );

  // client
  //   .getMessageContent(event.message.id)
  //   .then((downloadStream) => downloadStream.pipe(uploadStream));
  client.getMessageContent(event.message.id).then(
    (stream) =>
      new Promise((resolve, reject) => {
        stream.pipe(uploadStrea);
        stream.on("end", () =>
          resolve(`/edy-images/${userId}_${timestamp}.jpg`)
        );
        stream.on("error", reject);
      })
  );

  // downloadStream.pipe(uploadStream);

  // const imageRes = await fetch(
  // fetch(`https://api-data.line.me/v2/bot/message/${event.message.id}/content`, {
  //   headers: {
  //     Authorization: `Bearer ${config.channelAccessToken}`,
  //   },
  // }).then((res) => fs.createReadStream(res.body).pipe(uploadStream));
  // const image = await imageRes.blob();
  // fs.createReadStream(image).pipe(uploadStream);
};

module.exports = { createReplyObject, reply, storeImage };
