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
    default: 7777,
  },
});

module.exports = mongoose.model("Adminuser", UserSchema);
