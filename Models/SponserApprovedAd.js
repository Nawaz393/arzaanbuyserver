const mongoose = require("mongoose");
const Schema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  location: {
    type: Number,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },

  expireAt: {
    type: Date,
    expires:0,
    required: true,
  },
});

module.exports = mongoose.model("SponserApprovedAds", Schema);
