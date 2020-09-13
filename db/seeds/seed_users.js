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
          phone_number: "09012345678",
          email: "hanako.yamada@emptydressy.com",
          image_url:
            "https://illalet.com/wp-content/uploads/illust/16_2_424.png",
          to_check: 0,
          created_at: "2020-05-24 05:33:57.292593+00",
        },
        {
          line_user_id: "Tf42bb47c877c9e5543ca4eda7661e142",
          profile_name: "まさみ",
          first_name: "長澤",
          last_name: "まさみ",
          phone_number: "09087654321",
          email: "masami.nagasawa@emptydressy.com",
          image_url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS4qGsMPG4ENgYhAfmp6_SeuhUGt1u_qpu2Yw&usqp=CAU",
          to_check: 0,
          created_at: "2020-05-24 05:33:57.292594+00",
        },
        {
          line_user_id: "Vf42bb47c877c9e5543ca4eda7661e142",
          profile_name: "あんじゅーる😎✨",
          first_name: "_",
          last_name: "_",
          phone_number: "_",
          email: "_",
          image_url:
            "https://profile.line-scdn.net/0hnEYK4MOIMWpkMhgivLtOPVh3PwcTHDciHAZ-CEFgawlOUXBrDFx8DRVnbVlJBH5uDVErCkZlaVJI/preview",
          to_check: 0,
          created_at: "2020-05-24 05:33:57.292595+00",
        },
      ]);
    });
};
