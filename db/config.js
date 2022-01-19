const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    throw new Error("No se pudo conectar a la base de datos.");
  }
};

module.exports = {
  dbConnection,
};
