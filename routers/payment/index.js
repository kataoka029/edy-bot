const dotenv = require("dotenv");
const express = require("express");

const { stripeSecretTestKey } = require("../../config");

const paymentRouter = express.Router();
dotenv.config();
const stripe = require("stripe")(stripeSecretTestKey);

paymentRouter.post("/", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "jpy",
    metadata: {
      email: req.body.email,
      familyName: req.body.familyName,
      lastName: req.body.lastName,
    },
  });
  res.json(paymentIntent);
});

module.exports = paymentRouter;
