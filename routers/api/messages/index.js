const express = require("express");
const fetch = require("node-fetch");

const { dropboxAccessToken } = require("../../../config");
const knexConfig = require("../../../knexfile").development;

const knex = require("knex")(knexConfig);
const messagesRouter = express.Router();

// GET
messagesRouter.get("/", () => {
  return [];
});

messagesRouter.get("/:id", (req, res) => {
  const messageId = req.params.id;

  return knex("messages")
    .where({ line_message_id: messageId })
    .select()
    .then((messages) => res.send(messages))
    .catch((err) => console.log("ERROR - GET /api/messages/:id - ", err));
});

// POST
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
      .catch((err) => console.log("ERROR - POST /api/messages - ", err));
  }
});

// PATCH
messagesRouter.patch("/url", (req, res) => {
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
    .catch((err) => console.log("ERROR - PATCH /api/messgaes/content - ", err));
});

messagesRouter.patch("/:id/path", (req, res) => {
  const messageId = req.params.id;
  const imagePath = req.body.imagePath;

  return knex("messages")
    .where({ line_message_id: messageId })
    .update({ image_path: imagePath })
    .then(res.status(204).send())
    .catch((err) =>
      console.log("ERROR - PATCH /api/messgaes/:id/path - ", err)
    );
});

module.exports = messagesRouter;
