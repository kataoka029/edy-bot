exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(() => {
      return knex("users").insert([
        {
          line_user_id: "Uf42bb47c877c9e5543ca4eda7661e142",
          user_id: 10001,
          last_name: "俊太郎",
          first_name: "片岡",
          email: "shuntaro.kataoka@emptydressy.com",
          created_at: "2020-05-24 05:33:57.292593+00",
          updated_at: "2020-05-24 05:33:57.292593+00",
        },
      ]);
    });
};
