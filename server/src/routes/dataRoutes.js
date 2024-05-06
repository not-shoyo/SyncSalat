const express = require("express");
const axios = require("axios");

const UserModel = require("../../models/User");
const FriendsRelation = require("../../models/FriendsRelation");
const UserStats = require("../../models/UserStats");

const withinOneDay = require("../../utilities/utils");

const router = express.Router();

router.get("/getPrayerTimes", (req, res) => {
  const { currentDate, latitude, longitude } = req.query;

  const requestEndpoint = `https://api.aladhan.com/v1/timings/${currentDate}?latitude=${latitude}&longitude=${longitude}`;

  axios
    .get(requestEndpoint)
    .then((response) => {
      const { timings } = response.data.data;

      res.json(timings);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch prayer times" });
      console.error("Error:", error);
    });
});

router.get("/getNameAndPrayerData", async (req, res) => {
  const { username } = req.query;

  const queryReturn = await UserModel.findOne(
    { username: username },
    { name: 1, lastFivePrayers: 1, _id: 0 }
  );

  if (!queryReturn) {
    console.error("Found no matching user");
    return res
      .status(500)
      .json({ error: "Incorrect return from DB - no users" });
  }

  return res.json(queryReturn);
});

router.get("/getFriendsNameAndPrayerData", async (req, res) => {
  const { username } = req.query;

  const friendsQueryReturn = await FriendsRelation.findOne(
    { username },
    { friends: 1 }
  );

  if (!friendsQueryReturn) {
    console.error("Found no matching user friends relation");
    return res
      .status(500)
      .json({ error: "Incorrect return from DB - no user friend relation" });
  }

  const queryReturn = await UserModel.find(
    {
      username: {
        $in: friendsQueryReturn.friends,
      },
    },
    { username: 1, name: 1, lastFivePrayers: 1, _id: 0 }
  );

  if (!queryReturn) {
    console.error("Found no matching user");
    return res
      .status(500)
      .json({ error: "Incorrect return from DB - no users" });
  }

  return res.json(queryReturn);
});

router.get("/getUserStatsData", async (req, res) => {
  const { username } = req.query;

  const queryResponse = await UserStats.findOne(
    { username },
    {
      name: 1,
      daysStats: 1,
      prayersStats: 1,
    }
  );

  if (!queryResponse) {
    console.log(`No query response in userstats for username: ${username}`);
    return res.status(500).json({
      error: `No query response in userstats for username: ${username}`,
    });
  }

  return res.status(200).json(queryResponse);
});

router.put("/setUserPrayer", async (req, res) => {
  const { username, currentPrayerIdx, donePrayerDiff } = req.body;
  const currentPrayerDate = new Date();

  const userQueryReturn = await UserModel.findOne(
    { username },
    { lastPrayerIdx: 1, lastPrayerDate: 1 }
  ).lean();
  const { lastPrayerIdx, lastPrayerDate } = userQueryReturn;

  if (
    currentPrayerIdx === lastPrayerIdx &&
    withinOneDay(currentPrayerDate, lastPrayerDate)
  ) {
    console.log(
      `Prayer Entry already made for currentPrayeridx : ${currentPrayerIdx}`
    );
    return res.status(208).json({
      message: `Prayer Entry already made for currentPrayeridx : ${currentPrayerIdx}`,
    });
  }

  const prayerQueryReturn = await UserModel.findOneAndUpdate(
    { username },
    {
      $set: {
        [`lastFivePrayers.${currentPrayerIdx}.prayerHr`]: donePrayerDiff.hr,
        [`lastFivePrayers.${currentPrayerIdx}.prayerMin`]: donePrayerDiff.min,
        [`lastFivePrayers.${currentPrayerIdx}.prayerSec`]: donePrayerDiff.sec,
        lastPrayerIdx,
        lastPrayerDate,
      },
    },
    { new: true }
  ).lean();

  // Send a response back to the client
  res.status(200).json({
    message: `PUT prayers request received and processed for user ${username}`,
  });
});

router.put("/setUserStats", async (req, res) => {
  const { username, currentPrayerIdx } = req.body;
  const currentPrayerDate = new Date();

  const statsQueryReturn = await UserStats.findOne(
    { username },
    { lastPrayerIdx: 1, lastPrayerDate: 1, daysStats: 1, prayersStats: 1 }
  ).lean();

  const { lastPrayerIdx, lastPrayerDate, daysStats, prayersStats } =
    statsQueryReturn;

  if (
    currentPrayerIdx === lastPrayerIdx &&
    withinOneDay(currentPrayerDate, lastPrayerDate)
  ) {
    console.log(
      `Stats Entry already made for currentPrayeridx : ${currentPrayerIdx}`
    );
    return res.status(208).json({
      message: `Stats Entry already made for currentPrayeridx : ${currentPrayerIdx}`,
    });
  }

  let updationObject = {};

  const newLastPrayerIdx = currentPrayerIdx;
  const newLastPrayerDate = currentPrayerDate;

  const newDaysStats = { ...daysStats };
  const newPrayersStats = { ...prayersStats };

  if (
    currentPrayerIdx === (lastPrayerIdx + 1) % 5 &&
    withinOneDay(currentPrayerDate, lastPrayerDate)
  ) {
    const newPrayersStatsCurrent = prayersStats.current + 1;
    if (prayersStats.current === prayersStats.best) {
      newPrayersStats.current = newPrayersStatsCurrent;
      newPrayersStats.best = newPrayersStatsCurrent;
    } else {
      newPrayersStats.current = newPrayersStatsCurrent;
    }

    if (
      currentPrayerIdx === 0 &&
      withinOneDay(currentPrayerDate, lastPrayerDate)
    ) {
      const newDaysStatsCurrent = newDaysStatsCurrent;
      if (daysStats.current === daysStats.best) {
        newDaysStats.current = newDaysStatsCurrent;
        newDaysStats.best = newDaysStatsCurrent;
      } else {
        newDaysStats.current = newDaysStatsCurrent;
      }
    }

    updationObject = {
      lastPrayerIdx: newLastPrayerIdx,
      lastPrayerDate: newLastPrayerDate,
      daysStats: newDaysStats,
      prayersStats: newPrayersStats,
    };
  } else {
    updationObject = {
      lastPrayerIdx: newLastPrayerIdx,
      lastPrayerDate: newLastPrayerDate,
      daysStats: { ...newDaysStats, current: 1 },
      prayersStats: { ...newPrayersStats, current: 1 },
    };
  }

  const updateStatsQueryReturn = await UserStats.findOneAndUpdate(
    { username },
    {
      $set: updationObject,
    },
    { new: true }
  );

  // Send a response back to the client
  return res.status(200).json({
    message: `PUT stats request received and processed for user ${username}`,
  });
});

module.exports = router;
