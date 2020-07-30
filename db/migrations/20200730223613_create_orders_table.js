exports.up = function (knex) {
  return knex.schema.hasTable("orders").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("orders", (t) => {
        t.increments().primary();
        t.string("line_user_id").notNullable();
        t.integer("amount").notNullable();
        t.integer("price_adj").notNullable();
        t.string("item_id").notNullable();
        t.integer("cancel_flg").notNullable();
        t.integer("return_flg").notNullable();
        t.string("charge_id").notNullable();
        t.string("remotelock_id").notNullable();
        t.string("key").notNullable();
        t.datetime("purchased_at").notNullable();
        t.datetime("scheduled_at").notNullable();
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      });
    } else {
      return new Error("The table already exists.");
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
