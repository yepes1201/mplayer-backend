const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { request, response } = require("express");
const { validateFileExtension } = require("../helpers/file-validation");
const Song = require("../models/song");
const User = require("../models/user");

const songsGet = async (req = request, res = response) => {
  // Get user ID
  const { id } = req.params;

  // Get songs from DB
  const songs = (await Song.find({ user: id })) || [];

  res.json({ songs });
};

const songGet = async (req = request, res = response) => {
  // Get song ID
  const { id } = req.params;

  // Get song from DB
  const song = (await Song.findById(id)) || [];
  res.json(song);
};

const songsPost = async (req = request, res = response) => {
  const { title, artist, user } = req.body;
  const { src, img } = req.files;

  // Verify if audio file exists
  if (!src) {
    return res.status(400).json({
      msg: "Please provide the audio file",
    });
  }

  // Validate audio file extension
  if (!validateFileExtension(src)) {
    return res.status(400).json({
      msg: "Audio file extension not valid",
    });
  }

  try {
    let imgUrl;
    // Verify if image file exists
    if (img) {
      // Validate image file extension
      if (!validateFileExtension(img, false)) {
        return res.status(400).json({
          msg: "Image file extension not valid",
        });
      }
      // Upload image file
      const { secure_url } = await cloudinary.uploader.upload(img.tempFilePath);
      imgUrl = secure_url;
    }

    // Upload audio file
    let srcUrl;
    const { secure_url } = await cloudinary.uploader.upload(src.tempFilePath, {
      resource_type: "video",
    });
    srcUrl = secure_url;

    // Instance Song
    const song = new Song({
      title,
      artist,
      src: srcUrl,
      img: imgUrl,
      user,
    });

    // Save Song in DB
    await song.save();

    res.status(201).json({
      statusCode: 201,
      body: { song },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Server error. Please try again",
    });
  }
};

const songsDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Delete Song from DB
  const { src, img } = await Song.findByIdAndDelete(id);

  // Delete Audio file from Cloudinary
  if (src) {
    const arr = src.split("/");
    const [name] = arr[arr.length - 1].split(".");
    await cloudinary.uploader.destroy(name);
  }

  // Delete Image from Cloudinary
  if (img) {
    const arr = src.split("/");
    const [name] = arr[arr.length - 1].split(".");
    await cloudinary.uploader.destroy(name);
  }

  res.json({
    msg: "Song deleted",
  });
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

const updateFavorites = async (req = request, res = response) => {
  const { id } = req.params;
  const newFavSongs = req.body;

  const user = await User.findByIdAndUpdate(id, { favSongs: newFavSongs });
  console.log(user);

  res.status(200).json({
    msg: "Songs updated",
  });
};

module.exports = {
  songsGet,
  songsPost,
  songsDelete,
  songsPut,
  songGet,
  updateFavorites,
};
