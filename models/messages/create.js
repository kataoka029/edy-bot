const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const createMessage = (req, res) => {
  const event = req.body[0];
  // ここでusersテーブルからuserIdをゲットする？
  const userId =
    event.source.userId === "Uf42bb47c877c9e5543ca4eda7661e142" ? 10001 : 0;
  console.log(userId, event.source.userId);
  return knex("messages").insert({
    user_id: userId,
    line_type: event.type,
    line_reply_token: event.replyToken,
    line_user_id: event.source.userId,
    line_user_type: event.source.type,
    line_message_id: event.message.id,
    line_message_type: event.message.type,
    line_message_text: event.message.text,
  });
};

module.exports = createMessage;
