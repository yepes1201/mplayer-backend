const Song = require("../models/song");
const User = require("../models/user");

// Songs validations
const songExist = async (id) => {
  const songExist = await Song.findById(id);
  if (!songExist) throw new Error(`Song with ID ${id} doesn't exist`);
};

// User validations
const emailExists = async (email) => {
  const emailExists = await User.findOne({ email });
  if (emailExists) throw new Error(`User with email ${email} already exists.`);
};

const userIDExists = async (id) => {
  const userIDExists = await User.findById(id);
  if (userIDExists) {
    throw new Error(`User with ID ${id} doesn't exist.`);
  }
};

module.exports = {
  songExist,
  emailExists,
  userIDExists,
};
