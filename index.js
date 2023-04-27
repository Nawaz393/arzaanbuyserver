const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CheckBoostedAds = require("./CheckExpires");
require("dotenv").config();
const app = express();
const adsRoute = require("./Routers/PersonalAdsRoute");
const userRoute = require("./Routers/UserRoute");
const publicAdsRoute = require("./Routers/PublicUserAdsRoute");
const UserPersonalARoute = require("./Routers/UserPersonalRoute");
const AdminRoute = require("./Routers/AdminRoute");
const SponserAdRoute = require("./Routers/SponserAdsRoute");
const paymentRoute = require("./Routers/PaymentRoutes");

const options = {
  origin: ["http://localhost:5174", "http://localhost:5173","https://jade-seahorse-997ed8.netlify.app"],
  optionsSuccessStatus: 200,
};

CheckBoostedAds();

app.use(cors(options));

app.use(express.json({ limit: "20mb", extended: true, maxPayload: 52428800 }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/public", publicAdsRoute);
app.use("/personal", UserPersonalARoute);
app.use("/personalads", adsRoute);
app.use("/user", userRoute);
app.use("/admin", AdminRoute);
app.use("/sponserad", SponserAdRoute);
app.use("/payment", paymentRoute);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
