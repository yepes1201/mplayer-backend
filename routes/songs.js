const { Router } = require("express");

const { check } = require("express-validator");
const { validateForm } = require("../middlewares/validate-form");

const { songExist } = require("../helpers/db-validation");

const {
  songsGet,
  songsPost,
  songsDelete,
  songsPut,
} = require("../controllers/songs");

const router = Router();

router.get(
  "/",
  [check("songsArrId", "Please send a list of IDs").isArray(), validateForm],
  songsGet
);

router.post(
  "/",
  [
    check("name", "Please type the name of the song").not().isEmpty(),
    check("artist", "Please type the artist of the song").not().isEmpty(),
    check("srcURL", "Please type the audio url of the song").not().isEmpty(),
    check("imgURL", "Please type the image url of the song").not().isEmpty(),
    validateForm,
  ],
  songsPost
);

router.put(
  "/:id",
  [
    check("id", "ID doesn't exist").isMongoId(),
    check("id").custom(songExist),
    validateForm,
  ],
  songsPut
);

router.delete(
  "/:id",
  [
    check("id", "ID doesn't exist").isMongoId(),
    check("id").custom(songExist),
    validateForm,
  ],
  songsDelete
);

module.exports = router;
