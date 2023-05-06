const jwt = require("jsonwebtoken");
const Admin = require("../Models/Adminuser");
module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  

  if (!authorization) {
    return res.status(401).json("you must be logged in");
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json("you must be logged in");
    }

    const { id } = payload;

    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(401).json("you must be logged in");
      }
    } catch (error) {
      return res.status(401).json("you must be logged in");
    }
    next();
  });
};
