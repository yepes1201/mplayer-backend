const jwt = require("jsonwebtoken");

const generateJWT = async (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      { expiresIn: "6h" },
      (err, token) => {
        if (err) {
          reject("Token couldn't be generated");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
