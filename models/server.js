require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.songsRoute = "/api/songs";
    this.usersRoute = "/api/users";
    this.authRoute = "/api/auth";

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
    this.app.use(cors());

    // Body parser
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.songsRoute, require("../routes/songs"));
    // this.app.use(this.usersRoute, require("../routes/songs"));
    // this.app.use(this.authRoute, require("../routes/songs"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server running on port`, this.port)
    );
  }
}

module.exports = { Server };
