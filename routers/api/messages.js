const express = require("express");
const getMessages = require("../../models/messages/get.js");
const createMessage = require("../../models/messages/create.js");

const messagesRouter = express.Router();

messagesRouter.get("/:userId", (req, res) => {
  getMessages(req)
    .then((messages) => res.send(messages))
    .catch((err) => res.status(400).send(err.message));
});

messagesRouter.post("/", (req, res) => {
  createMessage(req)
    .then((messages) => res.send(messages))
    .catch((err) => console.log(`ERROR in createMessage(): ${err}`));
});

module.exports = messagesRouter;
