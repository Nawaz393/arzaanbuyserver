const jwt = require("jsonwebtoken");
const User = require("../Models/User");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("you must be logged in");
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json("you must be logged in");
    }

    const { id } = payload;

    try {
      const user = User.findById(id);
      if (!user) {
        return res.status(401).json("you must be logged in");
      }
    } catch (error) {
      return res.status(401).json("you must be logged in");
    }
    next();
  });
};
