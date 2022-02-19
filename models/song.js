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
  src: {
    type: String,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
});

SongSchema.methods.toJSON = function () {
  const { __v, _id, ...song } = this.toObject();
  return {
    sid: _id,
    ...song,
  };
};

module.exports = model("Song", SongSchema);
