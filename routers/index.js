const express = require("express");

const rootRouter = express.Router();

rootRouter.use("/webhook", require("./webhook"));
rootRouter.use("/api", express.json());
rootRouter.use("/api", require("./api"));
rootRouter.use("/payment", express.json());
rootRouter.use("/payment", require("./payment"));

rootRouter.get("/", (req, res) => res.render("index.html"));

module.exports = rootRouter;
