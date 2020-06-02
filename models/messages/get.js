const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const getMessages = (req, res) => {
  const userId = Number(req.query.u);
  return knex("messages")
    .where({ user_id: userId })
    .orderBy("created_at")
    .select();
};

module.exports = getMessages;
