const express = require("express");
const fetch = require("node-fetch");

const { client, dropboxAccessToken } = require("../../config");
const knexConfig = require("../../knexfile.js").development;

const knex = require("knex")(knexConfig);
const apiRouter = express.Router();

apiRouter.get("/messages", () => {
  return [];
});

apiRouter.get("/messages/:id", (req, res) => {
  const messageId = req.params.id;

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
    .then(() => console.log("SUCCESS - GET /api/messages/:id"))
    .catch((err) => console.log("ERROR - GET /api/messages/:id - ", err));
});

apiRouter.get("/users/:id", (req, res) => {
  const lineUserId = req.params.id;

  return knex("users")
    .where({ line_user_id: lineUserId })
    .select()
    .then((user) => res.send(user))
    .then(() => console.log("SUCCESS - GET /api/users/:id"))
    .catch((err) => console.log("ERROR - GET /api/users/:id - ", err));
});

apiRouter.get("/users/:id/messages", (req, res) => {
  const lineUserId = req.params.id;

  return knex("messages")
    .where({ line_user_id: lineUserId })
    .orderBy("created_at")
    .select()
    .then((messages) => res.send(messages))
    .then(() => console.log("SUCCESS - GET /api/users/:id/messages"))
    .catch((err) => console.log("ERROR - GET /api/users/:id/messages - ", err));
});

apiRouter.post("/messages", (req, res) => {
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

apiRouter.post("/users", (req, res) => {
  const event = req.body[0];
  const user = {
    line_user_id: event.source.userId,
    profile_name: "_",
    last_name: "_",
    first_name: "_",
    email: "_",
    image_url: "_",
  };

  return knex("users")
    .select()
    .where("line_user_id", event.source.userId)
    .then((rows) => {
      if (rows.length === 0) {
        knex("users")
          .insert(user)
          .then(() => res.status(201).send());
      }
    })
    .then(() => console.log("SUCCESS - POST /api/users"))
    .catch((err) => console.log("ERROR - POST /api/users - ", err));
});

apiRouter.post("/users/:id/messages", (req, res) => {
  const lineUserId = req.params.id;
  const message = req.body[0].message;

  client
    .pushMessage(lineUserId, message)
    .then(res.status(201).send())
    .then(() => console.log("SUCCESS - POST /api/users/:lineUserId/messages"))
    .catch((err) =>
      console.log("ERROR - POST /api/users/:lineUserId/messages - ", err)
    );
});

apiRouter.patch("/messages/url", (req, res) => {
  return knex("messages")
    .select()
    .then((messages) => {
      const targetMessages = messages.filter(
        (message) => message.image_path !== "_" && message.image_url === "_"
      );

      for (const message of targetMessages) {
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
            if (originalUrl) {
              const url =
                originalUrl.slice(0, originalUrl.indexOf("?") + 1) + "raw=1";
              return knex("messages")
                .where({ line_message_id: message.line_message_id })
                .update({ image_url: url });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /api/messgaes/content"))
    .catch((err) => console.log("ERROR - PATCH /api/messgaes/content - ", err));
});

apiRouter.patch("/messages/:id/path", (req, res) => {
  const messageId = req.params.id;
  const imagePath = req.body.imagePath;

  return knex("messages")
    .where({ line_message_id: messageId })
    .update({ image_path: imagePath })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /api/messgaes/:id/path"))
    .catch((err) =>
      console.log("ERROR - PATCH /api/messgaes/:id/path - ", err)
    );
});

apiRouter.patch("/users/:id/messages/read", (req, res) => {
  const lineUserId = req.params.id;
  return knex("messages")
    .where({ line_user_id: lineUserId })
    .update({ unread: 0 })
    .then(res.status(204).send())
    .then(() => console.log("SUCCESS - PATCH /api/users/:id/messages/read"))
    .catch((err) =>
      console.log("ERROR - POST /api/users/:id/messages/read - ", err)
    );
});

module.exports = apiRouter;
