const { Router } = require("express");
const { check } = require("express-validator");

const { validateForm } = require("../middlewares/validate-form");
const { validateJWT } = require("../middlewares/validate-jwt");

const { songExist, userIDExists } = require("../helpers/db-validation");

const {
  songsGet,
  songsPost,
  songsDelete,
  songsPut,
  songGet,
  updateFavorites,
} = require("../controllers/songs");

const router = Router();

// Get users songs
router.get(
  "/:id",
  [
    validateJWT,
    check("id", "Please provide user id").isMongoId(),
    check("id").custom(userIDExists),
    validateForm,
  ],
  songsGet
);

// Get song by id
router.get(
  "/song/:id",
  [
    validateJWT,
    check("id", "Please provide song id").isMongoId(),
    check("id").custom(songExist),
    validateForm,
  ],
  songGet
);

// Create Song
router.post(
  "/",
  [
    validateJWT,
    check("title", "Please type the song's title").notEmpty(),
    check("artist", "Please type the song's artist").notEmpty(),
    check(
      "user",
      "Please type the user id that is creating the song"
    ).notEmpty(),
    check("user", "User ID is not valid").isMongoId(),
    check("user").custom(userIDExists),
    validateForm,
  ],
  songsPost
);

// Update Song
router.put(
  "/:id",
  [
    check("id", "ID doesn't exist").isMongoId(),
    check("id").custom(songExist),
    validateForm,
  ],
  songsPut
);

// Delete Song
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "ID doesn't exist").isMongoId(),
    check("id").custom(songExist),
    validateForm,
  ],
  songsDelete
);

// Update Favorites Songs list
router.put(
  "/favorites/:id",
  [
    validateJWT,
    check("id", "Please provide user id").notEmpty(),
    check("id").isMongoId(),
    check("id").custom(userIDExists),
    validateForm,
  ],
  updateFavorites
);

module.exports = router;
