exports.seed = function (knex) {
  return knex("messages")
    .del()
    .then(() => {
      return knex("messages").insert([
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "_",
          type: "text",
          text: `LINEの友達追加ありがとうございます😀
ご質問がありましたら、おっしゃってください！`,
          image_path: "_",
          image_url: "_",
          reply_token: "_",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292593+00",
        },
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "12011694017334",
          type: "text",
          text: `はじめまして！
ちょっと質問なのですが、予約していない友達と一緒に来店しても大丈夫でしょうか？🤔`,
          image_path: "_",
          image_url: "_",
          reply_token: "4d33481b9b184aa8962311c100120207",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292594+00",
        },
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "_",
          type: "text",
          text: `はい、大丈夫ですよ🙆‍♀️
ご来店お待ちしております！`,
          image_path: "_",
          image_url: "_",
          reply_token: "_",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292595+00",
        },
        {
          line_user_id: "Tf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "_",
          type: "text",
          text: `LINEの友達追加ありがとうございます😀
ご質問がありましたら、おっしゃってください！`,
          image_path: "_",
          image_url: "_",
          reply_token: "_",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292596+00",
        },
        {
          line_user_id: "Tf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "22011694017334",
          type: "text",
          text: `いきなりすみません！
アルバイトの採用ってしていませんか？`,
          image_path: "_",
          image_url: "_",
          reply_token: "5d33481b9b184aa8962311c100120207",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292597+00",
        },
        {
          line_user_id: "Vf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "_",
          type: "text",
          text: `LINEの友達追加ありがとうございます😀
ご質問がありましたら、おっしゃってください！`,
          image_path: "_",
          image_url: "_",
          reply_token: "_",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292598+00",
        },
        {
          line_user_id: "Vf42bb47c877c9e5543ca4eda7661e142",
          line_message_id: "32011694017334",
          type: "text",
          text: `本日これからお伺いしたいのですが、大丈夫ですか？？`,
          image_path: "_",
          image_url: "_",
          reply_token: "6d33481b9b184aa8962311c100120207",
          unread: 1,
          created_at: "2020-05-24 05:33:57.292599+00",
        },
      ]);
    });
};
