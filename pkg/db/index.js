const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../config.env` });

(async function() {
  try {
    const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.tonpgxf.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
    await mongoose.connect(db);
    console.log("Successfully connected to DataBase");
  } catch (err) {
    console.log("Error connecting to DataBase", err);
  }
})();