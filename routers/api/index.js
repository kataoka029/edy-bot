const express = require("express");

const messagesRouter = require("./messages");
const ordersRouter = require("./orders");
const usersRouter = require("./users");

const apiRouter = express.Router();

apiRouter.use("/messages", messagesRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
