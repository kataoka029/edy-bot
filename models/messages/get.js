const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const getMessages = (req, res) => {
  const userId = Number(req.query.u);
  return knex("messages")
    .where({ user_id: userId })
    .orderBy("created_at")
    .select();
  // .then((messages) => {
  //   knex.destroy();
  //   return messages;
  // })
  // .catch((err) => {
  //   console.log(err);
  //   knex.destroy();
  // });
};

module.exports = getMessages;
