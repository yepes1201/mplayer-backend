const { request, response } = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Token = require("../models/token");

const { generateJWT } = require("../helpers/generate-jwt");
const { sendEmail } = require("../helpers/reset-password");

// * Register
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

// * Login
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

// * Password Reset
const resetPassword = async (req = request, res = response) => {
  const { email } = req.body;

  // Validate if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      msg: `User with email ${email} doesn't exists`,
    });
  }

  // If a previous token exists delete it
  const tokenExists = await Token.findOne({ user: user.id });
  if (tokenExists) await tokenExists.deleteOne();

  // Generate a new token and hash it
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = bcrypt.genSaltSync();
  const hashedToken = bcrypt.hashSync(resetToken, salt);

  // Save token in database
  await new Token({
    user: user.id,
    token: hashedToken,
    createdAt: Date.now(),
  }).save();

  // Send email to the user requesting password reset
  const link = `${process.env.APP_URL}/passwordreset?token=${resetToken}&id=${user.id}`;
  sendEmail(email, "Password Reset", { name: user.name, link });

  res.status(201).json({
    msg: "Email sended",
    ok: true,
  });
};

// * Token login
const tokenLogin = (req = request, res = response) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = {
  register,
  tokenLogin,
  login,
  resetPassword,
};
