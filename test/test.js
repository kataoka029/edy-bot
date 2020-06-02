const { expect, assert } = require("chai");
const config = require("../knexfile").development;
const knex = require("knex")(config);
const getMessages = require("../models/messages/get");
const createMessage = require("../models/messages/create");

describe("API", () => {
  beforeEach(async () => {
    await knex.seed.run();
  });

  describe("GET /api/messages", () => {
    it("should get messages which user id = 1", () => {
      const req = {
        query: {
          u: 1,
        },
      };
      getMessages(req).then((messages) => expect(messages.length).equal(3));
      getMessages(req).then((messages) =>
        expect(messages[0].line_message_text).equal(
          "LINEの友達追加ありがとうございます😀ご質問がありましたら、おっしゃってください！"
        )
      );
    });
  });
});
