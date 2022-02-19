require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      users: "/api/users",
      songs: "/api/songs",
    };

    // DB Connection
    this.connectDb();

    // Middlewares load
    this.middlewares();

    // Routes load
    this.routes();
  }

  async connectDb() {
    await dbConnection();
  }

  middlewares() {
    // CORS Settings
    this.app.use(cors({ origin: true }));

    // Body parser
    this.app.use(express.json());

    // File Upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.songs, require("../routes/songs"));
    // this.app.use(this.paths.users, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server running on port`, this.port)
    );
  }
}

module.exports = { Server };
