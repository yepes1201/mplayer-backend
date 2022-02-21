const { request, response } = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Token = require("../models/token");

const { generateJWT } = require("../helpers/generate-jwt");
const { sendEmail } = require("../helpers/reset-password");
const user = require("../models/user");

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
  console.log(email);

  // Validate if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      msg: `User with email '${email}' doesn't exists`,
      ok: false,
    });
  }

  // If a previous token exists delete it
  const tokenExists = await Token.findOne({ user: user.id });
  if (tokenExists) await tokenExists.deleteOne();

  // Generate a new token and hash it
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = bcrypt.genSaltSync();
  const hashedToken = bcrypt.hashSync(resetToken, salt);

  try {
    // Save token in database
    await new Token({
      user: user.id,
      token: hashedToken,
      createdAt: Date.now(),
    }).save();

    // Send email to the user requesting password reset
    const link = `${process.env.APP_URL}/auth/passwordreset?token=${resetToken}&id=${user.id}`;
    sendEmail(email, "Password Reset", { name: user.name, link });

    res.status(201).json({
      msg: `Email sent to '${email}'. Please check your inbox.`,
      ok: true,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong. Please try again later.",
      ok: false,
    });
  }
};

// * Confirm Reset Password
const confirmResetPassword = async (req = request, res = response) => {
  const { userId, token, password } = req.body;

  // Verify if token exists in database
  const passwordResetToken = await Token.findOne({ user: userId });
  if (!passwordResetToken) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid or expired password reset token.",
    });
  }

  // Verify if token is valid
  const isValid = bcrypt.compareSync(token, passwordResetToken.token);
  if (!isValid) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid or expired password reset token.",
    });
  }

  // Hash new password
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Update Password
  try {
    const user = await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
    await passwordResetToken.deleteOne();
    const loginToken = await generateJWT(user.id);
    res.status(201).json({
      ok: true,
      msg: "Password reseted successfully",
      user,
      loginToken,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Something went wrong. Please try again later.",
    });
  }
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
  confirmResetPassword,
};
