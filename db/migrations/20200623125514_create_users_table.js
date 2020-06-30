exports.up = function (knex) {
  return knex.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("users", (t) => {
        t.increments().primary();
        t.string("line_user_id").notNullable();
        t.string("last_name").notNullable();
        t.string("first_name").notNullable();
        t.string("email").notNullable();
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      });
    } else {
      return new Error("The table already exists.");
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
