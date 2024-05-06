// database.js
const mongoose = require("mongoose");

const connectToDatabase = (DB_URL) => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
    console.log(Object.keys(mongoose.connection.collections));
    mongoose.connection.collections["users"]
      .countDocuments()
      .then((response) => console.log(`num users: ${response}`));
  });
};

module.exports = { connectToDatabase };

// Run `mongod` in a separate shell to run MongoDB in the local system
// Database serving usually happens on mongodb://localhost:27017/syncSalat
