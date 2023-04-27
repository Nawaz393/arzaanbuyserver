const moongoose = require("mongoose");

const Schema = moongoose.Schema({
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
  days: {
    type: Number,
    required: true,
  },
});

module.exports = moongoose.model("SponserPendingAds", Schema);
