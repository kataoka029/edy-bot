const config = require("../../knexfile.js").development;
const knex = require("knex")(config);

const getUsers = (req, res) => {
  return knex.raw(`
    SELECT
      messages.user_id AS "userId",
      messages.line_message_text AS "userText",
      messages.created_at AS "userDate"
    FROM messages INNER JOIN 
      (SELECT
        user_id,
        MAX(created_at) AS created_at
      FROM messages
      GROUP BY user_id) AS sub
      ON messages.user_id = sub.user_id AND messages.created_at = sub.created_at
    ORDER BY messages.created_at DESC;`);
};

module.exports = getUsers;
