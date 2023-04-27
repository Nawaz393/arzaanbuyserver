const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: false,
    default: 1100,
  },

  address: {
    type: String,
    required: false,
  },

  bio: {
    type: String,
    required: false,
  },

  phone: {
    type: String,
    required: false,
  },

  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
