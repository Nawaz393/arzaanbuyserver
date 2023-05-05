const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = require("../utils/ValidationSchema/registerSchema");
const loginSchema = require("../utils/ValidationSchema/loginSchema");
const sendMail = require("../utils/mail");
const DeactivatedUsers = require("../Models/DeactivateUsers");

const profileSchema = require("../utils/ValidationSchema/profileValidator");
const cloudinary = require("../utils/cloudinary");

let unverifiedUsers = [];
let forgotPassword = [];
exports.registerUser = async (req, res) => {
  console.log(req.body);
  const { error, value } = registerSchema.validate(req.body, {
    abbortEarly: false,
  });

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (value.password != value.cpassword) {
    return res.status(400).send("password and confirm password must be same");
  }

  const alreadyregistered = await User.find({ email: value.email });
  console.log(alreadyregistered);
  if (alreadyregistered && alreadyregistered.length > 0) {
    return res.status(400).send("user is already registered");
  }
  //generate OTP using random number
  const OTP = Math.floor(100000 + Math.random() * 900000);
  unverifiedUsers.push({
    email: value.email,
    name: value.name,
    password: value.password,
    OTP: OTP,
  });

  //send OTP to user email

  try {
    const resp = await sendMail(
      value.email,
      "one time password",
      //create div for OTP
      `<div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
      <h1>OTP</h1>
    <p>use this otp to activate your account</p>
    <h2>${OTP}</h2>
    </div>`
    );

    if (!resp) {
      return res
        .status(400)
        .send("there is an error in sending the OTP please try again");
    }

    return res.status(200).send("OTP is sent to your email");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send("there is an error in sending the OTP please try again");
  }
};

// verify OTP and register user in database and remove user from unverifiedUsers array
exports.verifyOTP = async (req, res) => {
  const otp = req.body.otp;

  if (!otp) {
    return res.status(400).send("OTP is required");
  }

  if (otp.length != 6) {
    return res.status(400).send("OTP must be 6 digits");
  }

  // find user in unverifiedUsers array using OTP
  const user = unverifiedUsers.find((user) => user.OTP == otp);

  if (!user) {
    return res.status(400).send("invalid OTP");
  }

  // hash password and register user in database
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(user.password, salt);
  const nuser = {
    name: user.name,
    email: user.email,
    password: hashPassword,
  };

  const newUser = new User(nuser);

  try {
    const savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(400).send("there is an error in registering the user");
    }
    // remove user from unverifiedUsers array after registration
    const index = unverifiedUsers.indexOf(user);
    unverifiedUsers.splice(index, 1);

    return res.status(200).send("account  is registered successfully");
  } catch (error) {
    return res.status(400).send("there is an error in registering the user");
  }
};

// get all users from database
exports.getUser = async (req, res) => {
  const user = await User.find().select("-password");

  if (!user) {
    return res.status(400).send("user not found");
  }

  return res.status(200).send(user);
};

// login user and generate token for user
exports.loginUser = async (req, res) => {
  console.log(req.body);
  const { error, value } = loginSchema.validate(req.body, {
    abbortEarly: false,
  });

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.find({ email: value.email });

  console.log(user);
  if (user.length <= 0 || !user) {
    const deactivateduser = await DeactivatedUsers.find({ email: value.email });

    if (deactivateduser.length > 0) {
      return res
        .status(400)
        .send("your account are locked by admin please contact admin");
    }

    return res.status(400).send("email or password is incorrect");
  }

  const validPassword = await bcrypt.compare(value.password, user[0].password);

  if (!validPassword) {
    return res.status(400).send("email or password is incorrect");
  }

  const token = jwt.sign(
    { id: user[0]._id, role: user[0].role },
    process.env.TOKEN_SECRET
  );

  return res.status(200).send({
    token: token,
    user: {
      _id: user[0]._id,
      role: user[0].role,
    },
  });
};

//update user password

exports.forgotPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("email is required");
  }

  if (email.length < 5) {
    return res.status(400).send("invalid email");
  }

  const present = await User.find({ email: email });
  if (!present) {
    return res.status(400).send("email is not registered");
  }

  const OTP = Math.floor(100000 + Math.random() * 900000);

  const resp = await sendMail(
    email,
    "forgot code",

    `<div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
  <h1>Forgot Code</h1>
<p>use this otp change your password</p>
<h2>${OTP}</h2>
</div>`
  );

  if (!resp) {
    return res.status(400).send("there is an error in sending OTP");
  }

  forgotPassword.push({
    email: email,
    OTP: OTP,
  });

  return res.status(200).send("OTP is sent to your email");
};

exports.verifyForgotPassword = async (req, res) => {
  console.log(
    "-----------------------forgot password--------------------------------"
  );
  const { otp, password } = req.body;

  console.log("req body :", req.body);

  if (!otp || !password) {
    return res.status(400).send("otp and password is required");
  }

  if (otp.length != 6) {
    return res.status(400).send("invalid otp");
  }

  if (password.length < 8) {
    return res.status(400).send("password must be 8 characters long");
  }

  const user = forgotPassword.find((user) => user.OTP == otp);

  console.log("user from array", user);
  if (!user) {
    return res.status(400).send("invalid otp ");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  console.log("hashPassword", hashPassword);
  const update = await User.updateOne(
    { email: user.email },
    { $set: { password: hashPassword } }
  );

  // console.log("update", update);
  if (!update) {
    return res.status(400).send("there is an error in updating password");
  }

  const index = forgotPassword.indexOf(user);
  forgotPassword.splice(index, 1);
  return res.status(200).send("password is updated successfully");
};
