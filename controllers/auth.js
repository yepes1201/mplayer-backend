const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const register = async (req = request, res = response) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({
      name,
      email,
      password,
    });

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user to database
    await user.save();

    // Generate Token
    const token = await generateJWT(user.id);

    res.status(201).json({
      msg: "User created",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server error. Please try again later.",
    });
  }
};

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        msg: "Invalid email/password. Please verify your credentials.",
      });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Invalid email/password. Please verify your credentials.",
      });
    }

    // Generate Token
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server error. Please try again later.",
    });
  }
};

const tokenLogin = (req = request, res = response) => {
  res.json({
    user: req.user,
  });
};

module.exports = {
  register,
  tokenLogin,
  login,
};
