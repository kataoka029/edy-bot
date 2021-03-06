const line = require("@line/bot-sdk");
const dotenv = require("dotenv");

dotenv.config();
const config = {
  channelSecret: process.env.SECRET_KEY,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;
const stripeSecretTestKey = process.env.STRIPE_SECRET_TEST_KEY;

const client = new line.Client(config);
const lineMiddleware = line.middleware(config);

const url =
  process.env.NODE_ENV === "production"
    ? "https://edy-bot.herokuapp.com/"
    : "http://localhost:4000/";

module.exports = {
  client,
  config,
  dropboxAccessToken,
  lineMiddleware,
  stripeSecretTestKey,
  url,
};
