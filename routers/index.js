const express = require("express");

const apiRouter = require("./api");
const webhookRouter = require("./webhook");
const paymentRouter = require("./payment");

const rootRouter = express.Router();

rootRouter.use("/webhook", webhookRouter);
rootRouter.use("/api", express.json());
rootRouter.use("/api", apiRouter);
rootRouter.use("/payment", express.json());
rootRouter.use("/payment", paymentRouter);

rootRouter.get("/", (req, res) => res.render("index.html"));

module.exports = rootRouter;
