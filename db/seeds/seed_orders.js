exports.seed = function (knex) {
  return knex("orders")
    .del()
    .then(() => {
      return knex("orders").insert([
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          amount: 3480,
          price_adj: 0,
          item_id: "_",
          cancel_flg: 1,
          return_flg: 0,
          charge_id: "ch_1H8ktyCCqPVaq2QX7SCCmWb7",
          remotelock_id: "0787a13f-deec-471a-b272-7ba5a14cea03",
          key: "6165",
          purchased_at: "2020-07-25 19:46:55",
          scheduled_at: "2020-07-26 08:00:00",
          created_at: "2020-07-25 19:46:55.292593+00",
        },
        {
          line_user_id: "Tf42bb47c877c9e5543ca4eda7661e142",
          amount: 3480,
          price_adj: 0,
          item_id: "10001",
          cancel_flg: 0,
          return_flg: 0,
          charge_id: "ch_1HA6CJCCqPVaq2QXr519aUFm",
          remotelock_id: "b3319931-1ff1-4a94-b02b-fed433ca0184",
          key: "5647",
          purchased_at: "2020-07-29 12:43:23",
          scheduled_at: "2020-07-29 19:00:00",
          created_at: "2020-07-29 12:43:23.292593+00",
        },
        {
          line_user_id: "Sf42bb47c877c9e5543ca4eda7661e142",
          amount: 3480,
          price_adj: 0,
          item_id: "_",
          cancel_flg: 0,
          return_flg: 0,
          charge_id: "ch_1HAUOeCCqPVaq2QXeiyz78mI",
          remotelock_id: "5c800abb-7bd8-4af5-afca-360a908d2cee",
          key: "6996",
          purchased_at: "2020-07-30 14:33:43",
          scheduled_at: "2020-07-31 13:00:00",
          created_at: "2020-07-30 14:33:43.292593+00",
        },
      ]);
    });
};
