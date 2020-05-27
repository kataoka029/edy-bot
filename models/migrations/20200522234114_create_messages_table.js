exports.up = function (knex) {
  return knex.schema.hasTable("messages").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("messages", (t) => {
        t.increments().primary();
        t.integer("user_id").notNullable();
        t.string("line_type").notNullable();
        t.string("line_reply_token").notNullable();
        t.string("line_user_id").notNullable();
        t.string("line_user_type").notNullable();
        t.string("line_message_id").notNullable();
        t.string("line_message_type").notNullable();
        t.string("line_message_text");
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      });
    } else {
      return new Error("The table already exists.");
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
