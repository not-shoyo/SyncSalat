const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
  username: String,
  name: String,
  daysStats: {
    current: Number,
    best: Number,
  },
  prayersStats: {
    current: Number,
    best: Number,
  },
  lastPrayerIdx: Number,
  lastPrayerDate: Date,
});

const UserStatsModel = mongoose.model("UserStats", UserStatsSchema);
module.exports = UserStatsModel;
