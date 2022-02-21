const { Schema, model } = require("mongoose");

const TokenSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 1800,
  },
});

module.exports = model("Token", TokenSchema);
