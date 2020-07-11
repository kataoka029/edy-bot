exports.up = function (knex) {
  return knex.schema.hasTable("messages").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("messages", (t) => {
        t.increments().primary();
        t.string("line_user_id").notNullable();
        t.string("line_message_id").notNullable();
        t.string("type").notNullable();
        t.string("text", 1000).notNullable();
        t.string("image_path").notNullable();
        t.string("image_url").notNullable();
        t.string("reply_token").notNullable();
        t.integer("unread").notNullable();
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      });
    } else {
      return new Error("The table already exists.");
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
