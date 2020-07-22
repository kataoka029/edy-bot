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
          email: "masami.nagasawa@emptydressy.com",
          image_url:
            "https://cdn.mainichi.jp/vol1/2020/06/30/20200630dde018200041000p/9.jpg",
          to_check: 0,
          created_at: "2020-05-24 05:33:57.292593+00",
        },
        {
          line_user_id: "Vf42bb47c877c9e5543ca4eda7661e142",
          profile_name: "あんじゅーる😎✨",
          first_name: "_",
          last_name: "_",
          email: "_",
          image_url:
            "https://profile.line-scdn.net/0hnEYKLe3pMWpkMhn6cMtOPVh3PwcTHDciHAZ-CEFgawlOUXBrDFx8DRVnbVlJBH5uDVErCkZlaVJI/preview",
          to_check: 0,
          created_at: "2020-05-24 05:33:57.292593+00",
        },
      ]);
    });
};
