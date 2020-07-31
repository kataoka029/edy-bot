const express = require("express");
const fetch = require("node-fetch");

const { client, dropboxAccessToken } = require("../../../config");
const knexConfig = require("../../../knexfile").development;

const knex = require("knex")(knexConfig);
const ordersRouter = express.Router();

module.exports = ordersRouter;
