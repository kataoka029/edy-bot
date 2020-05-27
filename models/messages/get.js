const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const getMessages = (req, res) => {
  const userId = Number(req.query.u);
  knex("messages")
    .where({ user_id: userId })
    .orderBy("created_at")
    .select()
    .then((messages) => res.send(messages))
    .catch((err) => res.status(400).send(err.message));
};

module.exports = getMessages;
