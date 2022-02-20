const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      msg: "Please login",
    });
  }

  try {
    // Get payload from token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Get user from id
    const user = await User.findById(uid);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        msg: "Invalid token. User not found in database.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      msg: "Invalid Token.",
    });
  }
};

module.exports = {
  validateJWT,
};
