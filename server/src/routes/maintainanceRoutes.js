const express = require("express");
const FriendsRelationModel = require("../../models/FriendsRelation");
const UserModel = require("../../models/User");
const UserStatsModel = require("../../models/UserStats");

const router = express.Router();

// Function to update user and create/update FriendsRelationModel
async function updateUserAndFriendsRelation(username, friends) {
  const updatedUser = await UserModel.findOneAndUpdate(
    { username },
    { $unset: { friends: 1 } },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new Error("User not found");
  }

  let friendsRelation = await FriendsRelationModel.findOne({ username });

  if (!friendsRelation) {
    friendsRelation = new FriendsRelationModel({
      username,
      friends: [],
    });
  }

  const uniqueFriendsSet = new Set(friendsRelation.friends);
  friends.forEach((friend) => uniqueFriendsSet.add(friend));
  friendsRelation.friends = Array.from(uniqueFriendsSet);

  await friendsRelation.save();

  return updatedUser;
}

router.patch(
  "/migrateAllFriendsDataToFriendsRelationSchema",
  async (req, res) => {
    const usernames = [
      "sampleUser",
      "sampleOtherUser1",
      "sampleOtherUser2",
      "sampleOtherUser3",
      "sampleOtherUser4",
    ];

    try {
      for (const username of usernames) {
        const queryResponse = await UserModel.findOne({ username }).lean();

        if (!queryResponse) {
          console.error(`User not found for username: ${username}`);
          continue;
        }

        const { username, friends } = queryResponse;

        await updateUserAndFriendsRelation(username, friends);
      }

      res.status(201).json({ message: "Users registered successfully" });
    } catch (error) {
      console.error("Error in migration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put("/addNewUsersStats", async (req, res) => {
  const sampleNewUserStats = new UserStatsModel({
    username: "sampleUser",
    daysStats: {
      current: 15,
      best: 20,
    },
    prayersStat: {
      current: 79,
      best: 100,
    },
    lastPrayerIdx: 4,
    lastPrayerDate: new Date(2023, 11, 2),
    // other fields...
  });

  const newUserStatObject = await sampleNewUserStats.save();

  if (!newUserStatObject) {
    console.error("newUserStatObject not created");
    return res.status(500).json({ error: "Couldnt create newUserStatObject" });
  }
  console.log("User saved to MongoDB:", newUserStatObject);

  return res.json(newUserStatObject);
});

module.exports = router;
