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
} = require("../controllers/songs");

const router = Router();

router.get(
  "/",
  [
    validateJWT,
    check("id", "Please provide user id").isMongoId(),
    check("id").custom(userIDExists),
    validateForm,
  ],
  songsGet
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Please type the name of the song").notEmpty(),
    check("artist", "Please type the artist of the song").notEmpty(),
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
