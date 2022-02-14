const { request, response } = require("express");
const Song = require("../models/song");

const songsGet = async (req = request, res = response) => {
  // Get array of songs ID
  const { songsArrId } = req.body;

  // Get songs from DB
  const songs = await Promise.all(
    songsArrId.map(async (id) => await Song.findOne({ _id: id }))
  );

  res.json({ songs });
};

const songsPost = async (req = request, res = response) => {
  const { name, artist, imgURL, srcURL } = req.body;

  // Create new Song
  const song = new Song({
    name,
    artist,
    imgURL,
    srcURL,
  });

  // Save to DB
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
