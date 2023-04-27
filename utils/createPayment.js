const paypal = require("./Paypal");
const paymentSchema = require("./ValidationSchema/PaymentValidator");

const Payment = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "http://localhost:5173" + "/success",
    cancel_url: "http://localhost:5173" + "/cancel",
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

exports.createPayment = async (val, res, link) => {
  const { error, value } = paymentSchema.validate(val, {
    abortEarly: false,
  });

  if (link) {
    console.log(link);
    Payment.redirect_urls.return_url = link;
  }
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  Payment.transactions[0].item_list.items.push(value);
  Payment.transactions[0].amount.total = value.price;

  paypal.payment.create(JSON.stringify(Payment), function (error, payment) {
    if (error) {
      Payment.transactions[0].item_list.items.splice(0, 1);
      Payment.transactions[0].amount.total = "";

      console.log(error);
      console.log(JSON.stringify(error));
      return res.status(400).json(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          console.log(payment.links[i].href);
          Payment.transactions[0].item_list.items.splice(0, 1);
          Payment.transactions[0].amount.total = "";
          return res.status(200).json(payment.links[i].href);
        }
      }
    }
  });
};

exports.xreatePayment = async (paymentJson) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(
      JSON.stringify(paymentJson),
      function (error, payment) {
        if (error) {
          console.log(error);
          console.log(JSON.stringify(error));
          reject(error);
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              resolve(payment.links[i].href);
            }
          }
        }
      }
    );
  });
};

exports.executePayment = async (payment_id, payer_id) => {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(payment_id, payer_id, function (error, payment) {
      if (error) {
        console.log(error);
        console.log(JSON.stringify(error));
        reject(error);
      } else {
        resolve(payment);
      }
    });
  });
};
