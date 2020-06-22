const express = require("express");
const config = require("../../../knexfile.js").development;
const knex = require("knex")(config);

const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  return knex
    .raw(
      `SELECT
      messages.line_user_id AS "lineUserId",
      messages.line_message_text AS "userText",
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
    ORDER BY messages.created_at DESC`
    )
    .then((users) => res.send(users.rows))
    .catch((err) => res.status(400).send(err.message));
});

module.exports = usersRouter;
