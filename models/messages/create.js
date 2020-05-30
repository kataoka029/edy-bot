const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const createMessage = (req, res) => {
  const event = req.body[0];
  // thenはとりあえず必要らしい
  knex("messages")
    .insert({
      user_id: 1,
      line_type: event.type,
      line_reply_token: event.replyToken,
      line_user_id: event.source.userId,
      line_user_type: event.source.type,
      line_message_id: event.message.id,
      line_message_type: event.message.type,
      line_message_text: event.message.text,
    })
    .catch((err) => {
      console.log(`ERROR in createMessage(): ${err}`);
    });
  res.end();
};

module.exports = createMessage;
