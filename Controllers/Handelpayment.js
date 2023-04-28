const approvedad = require("../Models/ApprovedAd");
const {
  createPayment,
  xreatePayment,
  executePayment,
} = require("../utils/createPayment");
const paymentSchema = require("../utils/ValidationSchema/PaymentValidator");

let adid = "";

const Payment = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "https://jade-seahorse-997ed8.netlify.app" + "/success",
    cancel_url: "https://jade-seahorse-997ed8.netlify.app" + "/cancel",
  },
  transactions: [
    {
      item_list: {
        items: [],
      },
      amount: {
        currency: "USD",
        total: "",
      },
      description: "Boosting your ads on ArzanBuy",
      payment_options: {
        allowed_payment_method: "IMMEDIATE_PAY",
      },
    },
  ],
};
exports.CreatePayment = async (req, res) => {
  adid = req.body.id;
  delete req.body.id;

  const { error, value } = paymentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  Payment.transactions[0].item_list.items.push(value);
  Payment.transactions[0].amount.total = value.price;
  try {
    const payment = await xreatePayment(Payment);

    if (!payment) {
      return res.status(400).json("error creating payment");
    }
    return res.status(200).json(payment);
  } catch (error) {
    return res.status(400).json("error creating payment");
  } finally {
    Payment.transactions[0].item_list.items.splice(0, 1);
    Payment.transactions[0].amount.total = "";
  }
};

exports.Success = async (req, res) => {
  console.log(req.query);
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  try {
    const execution = await executePayment(paymentId, payerId);

    if (execution.state == "approved") {
      try {
        const ad = await approvedad.findById(adid);
        ad.boost.boosted = true;
        ad.boost.to = new Date(Date.now() + 2 * 60 * 1000).getTime();
        ad.save();
      } catch (error) {
        console.log(error);
      }
      return res.status(200).json(execution);
    }
  } catch (error) {}
};
