const { Router } = require("express");

const { check } = require("express-validator");

const { emailExists } = require("../helpers/db-validation");
const { validateForm } = require("../middlewares/validate-form");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  register,
  login,
  tokenLogin,
  resetPassword,
} = require("../controllers/auth");

const router = Router();

router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email is required").isEmail(),
    check("email").custom(emailExists),
    check("password", "Password is required").notEmpty(),
    validateForm,
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty(),
    validateForm,
  ],
  login
);

router.post(
  "/resetpassword",
  [check("email", "Email is required").isEmail()],
  resetPassword
);

router.post("/token", validateJWT, tokenLogin);

module.exports = router;
