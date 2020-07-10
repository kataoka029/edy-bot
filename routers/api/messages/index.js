const express = require("express");
const knexConfig = require("../../../knexfile.js").development;
const knex = require("knex")(knexConfig);
const fetch = require("node-fetch");
const { url, dropboxAccessToken } = require("../../../config");

const messagesRouter = express.Router();

messagesRouter.get("/", (req, res) => {
  return [];
});

messagesRouter.get("/:messageId", (req, res) => {
  const messageId = req.params.messageId;
  if (messageId === "latest") {
    return knex
      .raw(
        `SELECT
        messages.line_user_id AS "lineUserId",
        users.id AS "userId",
        messages.line_message_type AS "messageType",
        messages.content AS "content",
        messages.created_at AS "userDate",
        sub2.count AS "unreadCount"
      FROM messages
        INNER JOIN (
          SELECT
            line_user_id,
            MAX(created_at) AS created_at
          FROM messages
          GROUP BY line_user_id
          ) AS sub1
            ON messages.line_user_id = sub1.line_user_id AND messages.created_at = sub1.created_at
        LEFT JOIN(
          SELECT
            line_user_id,
            count(*)
          FROM messages
          WHERE unread = 1
          GROUP BY line_user_id
          ) AS sub2
            ON messages.line_user_id = sub2.line_user_id
        LEFT JOIN users
          ON messages.line_user_id = users.line_user_id
      ORDER BY messages.created_at DESC`
      )
      .then((users) => res.send(users.rows))
      .catch((err) => res.status(400).send(err.message));
  }
  return knex("messages")
    .where({ line_message_id: messageId })
    .select()
    .then((message) => res.send(message))
    .then(() => console.log("SUCCESS - GET /messages/:messageId"))
    .catch((err) => console.log("ERROR - GET /messages/:messageId - ", err));
});

messagesRouter.get("/:messageId/imgUrl", async (req, res) => {
  const messageId = req.params.messageId;
  const response = await fetch(`${url}api/messages/${messageId}`);
  const messages = await response.json();
  const path = messages[0].path;
  const data = {
    path,
    settings: {
      requested_visibility: "public",
      audience: "public",
      access: "viewer",
    },
  };
  return fetch(
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
    {
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${dropboxAccessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      const originalUrl = jsonResponse.url;
      const url = originalUrl.slice(0, originalUrl.indexOf("?") + 1) + "raw=1";
      res.send(url);
    })
    .catch((err) => console.log(err));
});

messagesRouter.post("/", (req, res) => {
  const events = req.body;
  for (const event of events) {
    const message = {
      line_type: event.type,
      line_reply_token: event.replyToken,
      line_user_id: event.source.userId,
      line_user_type: event.source.type,
      line_message_id: event.message.id,
      line_message_type: event.message.type,
      path: "_",
      content: event.message.text || "_",
      unread: 1,
    };
    return knex("messages")
      .insert(message)
      .then(() => res.status(201).send())
      .then(() => "SUCCESS - POST /messages")
      .catch((err) => console.log("ERROR - POST /messages - ", err));
  }
});

messagesRouter.patch("/:messageId", (req, res) => {
  const messageId = req.params.messageId;
  const path = req.body.path;
  const imgUrl = req.body.imgUrl;

  return knex("messages")
    .where({ line_message_id: messageId })
    .update({ path, content: imgUrl })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /messgaes/:messageId"))
    .catch((err) => console.log("ERROR - POST /messgaes/:messageId - ", err));
});

module.exports = messagesRouter;
