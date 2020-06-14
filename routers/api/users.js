const express = require("express");
const getUsers = require("../../models/users/get.js");

const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  getUsers(req)
    .then((users) => res.send(users.rows))
    .catch((err) => res.status(400).send(err.message));
});

module.exports = usersRouter;
