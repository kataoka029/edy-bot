const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const getMessages = (req, res) => {
  const lineUserId = req.params.lineUserId;
  if (!lineUserId) return;
  return knex("messages")
    .where({ line_user_id: lineUserId })
    .orderBy("created_at")
    .select()
    .catch((err) => console.log("ERROR in getMessages(): ", err));
};

module.exports = getMessages;
