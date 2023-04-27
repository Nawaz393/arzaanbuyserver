const SponserPendingAd = require("../Models/SponserPendingAd");
const SponserApprovedAd = require("../Models/SponserApprovedAd");
const cloudinary = require("cloudinary").v2;
// const { createPayment } = require("../utils/createPayment");
//  createPayment(paymentdata, res, "http://localhost:5173/sponserSuccess");
const paymentSchema = require("../utils/ValidationSchema/PaymentValidator");
const { xreatePayment, executePayment } = require("../utils/createPayment");
var Logodata = {};
const Payment = {
  intent: "sale",
  payer: {
    payment_method: "paypal",
  },
  redirect_urls: {
    return_url: "http://localhost:5173" + "/sponserSuccess",
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

// const createPayment = async (val, res) => {
//   const { error, value } = paymentSchema.validate(val, {
//     abortEarly: false,
//   });

//   if (error) {
//     return res.status(400).json(error.details[0].message);
//   }
//   Payment.transactions[0].item_list.items.push(value);
//   Payment.transactions[0].amount.total = value.price;

//   paypal.payment.create(JSON.stringify(Payment), function (error, payment) {
//     if (error) {
//       Payment.transactions[0].item_list.items.splice(0, 1);
//       Payment.transactions[0].amount.total = "";

//       console.log(error);
//       console.log(JSON.stringify(error));
//       return res.status(400).json(error);
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === "approval_url") {
//           console.log(payment.links[i].href);
//           Payment.transactions[0].item_list.items.splice(0, 1);
//           Payment.transactions[0].amount.total = "";
//           return res.status(200).json(payment.links[i].href);
//         }
//       }
//     }
//   });
// };

exports.addSponserPendingAd = async (req, res) => {
  console.log(req.body);

  const { paymentdata, logodata } = req.body;

  Logodata = logodata;
  const { image, userid, link, location, days } = logodata;

  if (!image || !link || !location || !days || !userid) {
    return res.status(400).json("image, link are required");
  }

  const { error, value } = paymentSchema.validate(paymentdata, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  Payment.transactions[0].item_list.items.push(value);
  Payment.transactions[0].amount.total = value.price;

  try {
    const createpayment = await xreatePayment(Payment);

    if (!createpayment) {
      return res.status(400).json("there is an error in creating payment");
    }

    return res.status(200).json(createpayment);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in creating payment");
  } finally {
    Payment.transactions[0].item_list.items.splice(0, 1);
    Payment.transactions[0].amount.total = "";
  }

  // createPayment(paymentdata, res);
};

const uploadSponserAd = async (data) => {
  console.log("uploading image >>>>>>>>>>>>>>>");
  return new Promise(async (resolve, reject) => {
    const upload = await cloudinary.uploader.upload(data.image, {
      folder: "sponserads",
    });

    console.log(upload);
    if (!upload) {
      reject("there is an error in uploading image");
    }

    try {
      const newSponserPendingAd = new SponserPendingAd({
        image: upload.secure_url,
        userid: data.userid,
        link: data.link,
        location: data.location,
        days: data.days,
      });

      console.log(newSponserPendingAd);
      Logodata = {};

      const resp = await newSponserPendingAd.save();
      console.log(resp);
      if (!resp) {
        reject("there is an error in adding sponser ad please try again");
      }

      resolve("sponser ad is sended for admin approval");
    } catch (error) {
      console.log(error);
      reject("there is an error in adding sponser ad");
    }
  });
};

exports.Success = async (req, res) => {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  console.log(paymentId, payerId);

  try {
    const paymentexecute = await executePayment(paymentId, payerId);

    console.log(paymentexecute);
    if (!paymentexecute) {
      return res.status(400).json("there is an error in payment");
    }

    if (paymentexecute.state == "approved") {
      const upload = await uploadSponserAd(Logodata);

      if (!upload) {
        return res.status(400).json("there is an error in uploading image");
      }

      return res.status(200).json(paymentexecute);
    }
    return res.status(400).json("there is an error in payment");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in payment");
  }

  // paypal.payment.execute(paymentId, payerId, async function (error, payment) {
  //   if (error) {
  //     console.error(JSON.stringify(error));
  //     return res.status(400).json("there is an error in payment");
  //   } else {
  //     if (payment.state == "approved") {
  //       console.log("payment completed successfully");
  // try {
  //   const upload = await cloudinary.uploader.upload(Logodata.image, {
  //     folder: "sponserads",
  //   });

  //   if (!upload) {
  //     return res.status(400).json("there is an error in uploading image");
  //   }

  //   const newSponserApprovedAd = new SponserApprovedAd({
  //     image: upload.secure_url,
  //     userid: Logodata.userid,
  //     link: Logodata.link,
  //     location: Logodata.location,
  //     days: Logodata.days,
  //   });

  //   const resp = await newSponserApprovedAd.save();
  //   if (!resp) {
  //     return res

  //       .status(400)
  //       .json("there is an error in adding sponser ad please try again");
  //   }
  //   console.log("sponser ad added successfully");
  //   console.log(payment);
  //   return res.status(200).json(payment);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(400).json(error);
  // }
  // } else {
  //   res.status(400).json("payment not successful");
  // }
  //}
  // });
};

exports.getSponserPendingAds = async (req, res) => {
  const { userid } = req.query;
  console.log(req.query);

  console.log(userid);
  if (!userid) {
    return res.status(400).json("there is no ads to show");
  }
  try {
    const pendingads = await SponserPendingAd.find({ userid: userid });
    if (!pendingads) {
      return res.status(400).json("there is no pending ads");
    }
    return res.status(200).json(pendingads);
  } catch (error) {
    return res.status(400).json("there is an error in getting pending ads");
  }
};

exports.getSponserApprovedAds = async (req, res) => {
  const { userid } = req.query;
  if (!userid) {
    return res.status(400).json("there is no ads to show");
  }

  try {
    const approvedads = await SponserApprovedAd.find({ userid: userid });

    if (!approvedads) {
      return res.status(400).json("there is no approved ads");
    }
    return res.status(200).json(approvedads);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in getting approved ads");
  }
};

exports.getAllsponseredAds = async (req, res) => {
  try {
    const allsponseredads = await SponserApprovedAd.find();
    if (!allsponseredads) {
      return res.status(400).json("there is no ads to show");
    }
    return res.status(200).json(allsponseredads);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json("there is an error in getting all sponsered ads");
  }
};
