const config = require("../knexfile").development;
const knex = require("knex")(config);
const getMessages = require("../models/messages/get");
const createMessage = require("../models/messages/create");

describe("GET /api/messages", () => {
  beforeAll(async () => {
    await knex.seed.run();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test("should get messages (user_id: 1)", async () => {
    const req = {
      query: {
        u: 1,
      },
    };
    const messages = await getMessages(req);
    expect(messages.length).toBe(3);
    expect(messages[0].line_message_text).toBe(
      "LINEの友達追加ありがとうございます😀ご質問がありましたら、おっしゃってください！"
    );
  });

  test("should get messages (user_id: 2)", async () => {
    const req = {
      query: {
        u: 2,
      },
    };
    const messages = await getMessages(req);
    expect(messages[1].line_message_text).toBe(
      "いきなりすみません！アルバイトの採用ってしていませんか？💕"
    );
  });
});
