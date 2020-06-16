const express = require("express");
const config = require("../../../knexfile.js").development;
const knex = require("knex")(config);

const messagesRouter = express.Router();

messagesRouter.get("/", (req, res) => {
  return;
});

messagesRouter.get("/:lineUserId", (req, res) => {
  const lineUserId = req.params.lineUserId;
  if (!lineUserId) return;
  return knex("messages")
    .where({ line_user_id: lineUserId })
    .orderBy("created_at")
    .select()
    .then((messages) => res.send(messages))
    .catch((err) =>
      console.log("ERROR in GET /api/messages/{lineUserId}: ", err)
    );
});

messagesRouter.post("/", (req, res) => {
  const event = req.body[0];
  // ここでusersテーブルからuserIdをゲットする？
  const userId =
    event.source.userId === "Uf42bb47c877c9e5543ca4eda7661e142" ? 10001 : 0;
  return knex("messages")
    .insert({
      user_id: userId,
      line_type: event.type,
      line_reply_token: event.replyToken,
      line_user_id: event.source.userId,
      line_user_type: event.source.type,
      line_message_id: event.message.id,
      line_message_type: event.message.type,
      line_message_text: event.message.text,
    })
    .then((message) => res.send(message))
    .catch((err) => console.log("ERROR in POST /api/messages: ", err));
});

module.exports = messagesRouter;
