const express = require("express");

const { client } = require("../../../config");
const knexConfig = require("../../../knexfile").development;

const knex = require("knex")(knexConfig);
const usersRouter = express.Router();

// GET
usersRouter.get("/", (req, res) => {
  const query = `
    SELECT
      messages.line_user_id,
      users.id AS "user_id",
      users.profile_name,
      users.first_name,
      users.last_name,
      users.email,
      users.image_url,
      users.to_check,
      messages.type AS "text_type",
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
    ORDER BY messages.created_at DESC`;

  return knex
    .raw(query)
    .then((users) => res.send(users.rows))
    .catch((err) => console.log("ERROR - GET /api/users - ", err));
});

usersRouter.get("/:id", (req, res) => {
  const lineUserId = req.params.id;

  return knex("users")
    .where({ line_user_id: lineUserId })
    .select()
    .then((users) => res.send(users[0]))
    .catch((err) => console.log("ERROR - GET /api/users/:id - ", err));
});

usersRouter.get("/:id/messages", (req, res) => {
  const lineUserId = req.params.id;

  return knex("messages")
    .where({ line_user_id: lineUserId })
    .orderBy("created_at")
    .select()
    .then((messages) => res.send(messages))
    .catch((err) => console.log("ERROR - GET /api/users/:id/messages - ", err));
});

usersRouter.get("/:id/orders", (req, res) => {
  const lineUserId = req.params.id;

  return knex("orders")
    .where({ line_user_id: lineUserId })
    .orderBy("unlocked_at", "desc")
    .select()
    .then((orders) => res.send(orders))
    .catch((err) => console.log("ERROR - GET /api/users/:id/orders - ", err));
});

// POST
usersRouter.post("/", (req, res) => {
  const profile = req.body;
  const user = {
    line_user_id: profile.userId,
    profile_name: profile.displayName,
    last_name: "_",
    first_name: "_",
    phone_number: "_",
    email: "_",
    image_url: profile.pictureUrl,
    to_check: 0,
  };

  return knex("users")
    .where({ line_user_id: profile.userId })
    .select()
    .then((users) => {
      if (users.length === 0) {
        knex("users")
          .insert(user)
          .then(() => res.status(201).send());
      }
    })
    .catch((err) => console.log("ERROR - POST /api/users - ", err));
});

usersRouter.post("/:id/messages", (req, res) => {
  const lineUserId = req.params.id;
  const message = req.body[0].message;

  client
    .pushMessage(lineUserId, message)
    .then(res.status(201).send())
    .catch((err) =>
      console.log("ERROR - POST /api/users/:lineUserId/messages - ", err)
    );
});

// PATCH

usersRouter.patch("/:id/check", (req, res) => {
  const lineUserId = req.params.id;
  const query = `
  UPDATE users
  SET to_check =
    CASE
      WHEN to_check = 0 THEN 1
      ELSE 0
    END
    WHERE line_user_id = '${lineUserId}'`;

  return knex.raw(query).then(res.status(204).send());
});

usersRouter.patch("/:id/messages/read", (req, res) => {
  const lineUserId = req.params.id;

  return knex("messages")
    .where({ line_user_id: lineUserId })
    .update({ unread: 0 })
    .then(res.status(204).send())
    .catch((err) =>
      console.log("ERROR - POST /api/users/:id/messages/read - ", err)
    );
});

module.exports = usersRouter;
