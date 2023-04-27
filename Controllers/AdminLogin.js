const Admin = require("../Models/Adminuser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  try {
    const user = await Admin.find({ email: email });
    if (!user) {
      return res.status(400).json("email or password is incorrect");
    }
    const validPass = await bcrypt.compare(password, user[0].password);
    if (!validPass) {
      return res.status(400).json("email or password is incorrect");
    }
    const token = jwt.sign(
      { id: user[0]._id, role: user[0].role },
      process.env.TOKEN_SECRET
    );
    return res.status(200).json({
      token: token,
      role: user[0].role,
      name: user[0].name,
      email: user[0].email,
      id: user[0]._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in login");
  }
};
