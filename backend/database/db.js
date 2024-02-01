const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URL;
const DBConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlPArser: true });
    console.log("database connected successfully");
  } catch (error) {
    console.log("error connecting to database", error.message);
  }
};
module.exports = { DBConnection };
