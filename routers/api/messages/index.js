const express = require("express");
const fetch = require("node-fetch");

const { dropboxAccessToken } = require("../../../config");
const knexConfig = require("../../../knexfile.js").development;

const knex = require("knex")(knexConfig);
const messagesRouter = express.Router();

messagesRouter.get("/", () => {
  return [];
});

messagesRouter.get("/:messageId", (req, res) => {
  const messageId = req.params.messageId;

  if (messageId === "latest") {
    return knex
      .raw(
        `SELECT
        messages.line_user_id,
        users.id AS "user_id",
        messages.type,
        messages.text,
        messages.created_at,
        sub2.count AS "unread_count"
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
      .then((messages) => res.send(messages.rows))
      .then(() => console.log("SUCCESS - GET /api/messages/:messageId"))
      .catch((err) =>
        console.log("ERROR - GET /api/messages/:messageId - ", err)
      );
  }
  return knex("messages")
    .where({ line_message_id: messageId })
    .select()
    .then((messages) => res.send(messages))
    .then(() => console.log("SUCCESS - GET /api/messages/:messageId"))
    .catch((err) =>
      console.log("ERROR - GET /api/messages/:messageId - ", err)
    );
});

messagesRouter.post("/", (req, res) => {
  const events = req.body;

  for (const event of events) {
    const message = {
      line_user_id: event.source.userId,
      line_message_id: event.message.id,
      type: event.message.type,
      text: event.message.text || "_",
      image_path: "_",
      image_url: "_",
      reply_token: event.replyToken,
      unread: 1,
    };
    knex("messages")
      .insert(message)
      .then(() => res.status(201).send())
      .then(() => "SUCCESS - POST /api/messages")
      .catch((err) => console.log("ERROR - POST /api/messages - ", err));
  }
});

messagesRouter.patch("/content", (req, res) => {
  return knex("messages")
    .select()
    .then((messages) => {
      for (const message of messages) {
        if (message.type === "image" && message.text === "_") {
          const data = {
            path: message.image_path,
            settings: {
              requested_visibility: "public",
              audience: "public",
              access: "viewer",
            },
          };
          fetch(
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
              const url =
                originalUrl.slice(0, originalUrl.indexOf("?") + 1) + "raw=1";
              return knex("messages")
                .where({ line_message_id: message.line_message_id })
                .update({ content: url });
            })
            .catch((err) => console.log(err));
        }
      }
    })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /api/messgaes/content"))
    .catch((err) => console.log("ERROR - PATCH /api/messgaes/content - ", err));
});

messagesRouter.patch("/:messageId/path", (req, res) => {
  const messageId = req.params.messageId;
  const image_path = req.body.path;

  return knex("messages")
    .where({ line_message_id: messageId })
    .update({ image_path })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /api/messgaes/:messageId"))
    .catch((err) =>
      console.log("ERROR - PATCH /api/messgaes/:messageId - ", err)
    );
});

module.exports = messagesRouter;
