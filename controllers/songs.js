const { request, response } = require("express");
const Song = require("../models/song");

const songsGet = async (req = request, res = response) => {
  // Get array of songs ID
  const { id } = req.body;

  // Get songs from DB
  const songs = await Song.find({ user: id });

  res.json({ songs });
};

const songsPost = async (req = request, res = response) => {
  const { name, artist, user } = req.body;

  // Create Song
  const song = new Song({
    name,
    artist,
    user,
  });

  // Save Song in DB
  await song.save();

  res.json({ song });
};

const songsDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Delete song from DB
  const song = await Song.findByIdAndDelete(id);

  res.json({ song });
};

const songsPut = async (req = request, res = response) => {
  const { id } = req.params;
  const newSong = req.body;

  // Update song
  const song = await Song.findByIdAndUpdate(id, newSong);

  res.json({
    msg: "Song updated successfully",
    song,
  });
};

module.exports = {
  songsGet,
  songsPost,
  songsDelete,
  songsPut,
};
