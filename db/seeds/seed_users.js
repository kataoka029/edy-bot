exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(() => {
      return knex("users").insert([
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          profile_name: "HANAKO",
          first_name: "山田",
          last_name: "花子",
          email: "shuntaro.kataoka@emptydressy.com",
          image_url:
            "https://illalet.com/wp-content/uploads/illust/16_2_424.png",
          created_at: "2020-05-24 05:33:57.292593+00",
        },
      ]);
    });
};
