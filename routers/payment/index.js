const dotenv = require("dotenv");
const express = require("express");

const { stripeSecretTestKey } = require("../../config");

const paymentRouter = express.Router();
dotenv.config();
const stripe = require("stripe")(stripeSecretTestKey);

paymentRouter.post("/", async (req, res) => {
  const unitPrice = req.body.unitPrice;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const unlockeAt = req.body.unlockeAt;
  const userNum = req.body.userNum;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: unitPrice * userNum,
    currency: "jpy",
    metadata: {
      firstName,
      lastName,
      phoneNumber,
      unlockeAt,
      userNum,
    },
  });
  res.json(paymentIntent);
});

module.exports = paymentRouter;
