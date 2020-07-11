const express = require("express");

const { client } = require("../../../config");
const config = require("../../../knexfile.js").development;

const knex = require("knex")(config);
const usersRouter = express.Router();

usersRouter.get("/:lineUserId", (req, res) => {
  const lineUserId = req.params.lineUserId;

  return knex("users")
    .where({ line_user_id: lineUserId })
    .select()
    .then((user) => res.send(user))
    .then(() => console.log("SUCCESS - GET /api/users/:lineUserId"))
    .catch((err) => console.log("ERROR - GET /api/users/:lineUserId - ", err));
});

usersRouter.get("/:lineUserId/messages", (req, res) => {
  const lineUserId = req.params.lineUserId;

  return knex("messages")
    .where({ line_user_id: lineUserId })
    .orderBy("created_at")
    .select()
    .then((messages) => res.send(messages))
    .then(() => console.log("SUCCESS - GET /api/users/:lineUserId/messages"))
    .catch((err) =>
      console.log("ERROR - GET /api/users/:lineUserId/messages - ", err)
    );
});

usersRouter.post("/", (req, res) => {
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

usersRouter.post("/:lineUserId/messages", (req, res) => {
  const lineUserId = req.params.lineUserId;
  const message = req.body[0].message;

  client
    .pushMessage(lineUserId, message)
    .then(res.status(201).send())
    .then(() => console.log("SUCCESS - POST /api/users/:lineUserId/messages"))
    .catch((err) =>
      console.log("ERROR - POST /api/users/:lineUserId/messages - ", err)
    );
});

usersRouter.patch("/:lineUserId/messages/read", (req, res) => {
  const lineUserId = req.params.lineUserId;
  return knex("messages")
    .where({ line_user_id: lineUserId })
    .update({ unread: 0 })
    .then(res.status(204).send())
    .then(() =>
      console.log("SUCCESS - PATCH /api/users/:lineUserId/messages/read")
    )
    .catch((err) =>
      console.log("ERROR - POST /api/users/:lineUserId/messages/read - ", err)
    );
});

module.exports = usersRouter;
