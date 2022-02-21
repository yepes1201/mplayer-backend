const nodemailer = require("nodemailer");

const sendEmail = (email, subject, payload) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.FROM_PASS,
    },
  });
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject,
    html: `<h1>Reset Password</h1><p>Hi ${payload.name}, you have requested a password reset. Click <a href=${payload.link}>here</a> to reset your password.</p>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent:", info);
    }
  });
};

module.exports = {
  sendEmail,
};
