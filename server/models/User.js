const mongoose = require("mongoose");

// Define User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  lastFivePrayers: [
    {
      prayerName: String,
      prayerHr: Number,
      prayerMin: Number,
      prayerSec: Number,
    },
  ],
  friends: [String],
  lastPrayerIdx: Number,
  lastPrayerDate: Date,
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
