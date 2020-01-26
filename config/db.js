const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Mongo has been connected");
  } catch {
    process.exit(1); //Exits the process upon failure
    console.error(err.message);
  }
};

module.exports = connectDB;
