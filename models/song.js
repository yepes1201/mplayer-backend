const { Schema, model } = require("mongoose");

const SongSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  artist: {
    type: String,
    required: [true, "Artist is required"],
  },
  srcURL: {
    type: String,
    required: [true, "Source URL is required"],
  },
  imgURL: {
    type: String,
    required: [true, "Image URL is required"],
  },
});

SongSchema.methods.toJSON = function () {
  const { __v, ...song } = this.toObject();
  return song;
};

module.exports = model("Song", SongSchema);
