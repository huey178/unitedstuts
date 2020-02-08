const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Mongo has been connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); //Exits the process upon failure
  }
};

module.exports = connectDB;
