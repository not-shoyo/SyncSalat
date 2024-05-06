const mongoose = require("mongoose");

const FriendsRelationSchema = mongoose.Schema({
  username: String,
  friends: [String],
});

const FriendsRelationModel = mongoose.model(
  "FriendsRelation",
  FriendsRelationSchema
);

module.exports = FriendsRelationModel;
