const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },

  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  images: {
    type: Array,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  // boost: {
  //   boosted: {
  //     type: Boolean,
  //     required: false,
  //     default: false,
  //   },
  //   from: {
  //     type: Date,
  //     required: false,
  //   },
  //   to: {
  //     type: Date,
  //     required: false,
  //   },
  // },
});

module.exports = mongoose.model("PendingAd", adSchema);
