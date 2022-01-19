const Song = require("../models/song");

const songExist = async (id) => {
  const songExist = await Song.findById(id);
  if (!songExist) throw new Error(`Song with ID ${id} doesn't exist`);
};

module.exports = {
  songExist,
};
