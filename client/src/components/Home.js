import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import HeaderSection from "./HeaderSection";
import MiddleSection from "./MiddleSection";
import BottomSection from "./BottomSection";
import PrayerButtonSection from "./PrayerButtonSection";

import {
  IDX2PRAYER,
  PRAYER2IDX,
  handlePrePrayerReminder,
  handlePostPrayerReminder,
} from "../utilities/utils";

const Home = ({
  username,
  currentDate,
  latitudeLongitudeData,
  BACKEND_URL,
}) => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState("");
  const [userNameAndPrayerData, setUserNameAndPrayerData] = useState(undefined);
  const [userStatsData, setUserStatsData] = useState({});
  const [selectedFriend, setSelectedFriend] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const setThisPrayerTime = useCallback(async () => {
    const numPrayers = Object.keys(PRAYER2IDX).length;
    const currentPrayerIdx =
      PRAYER2IDX[nextPrayer] === 0
        ? numPrayers - 1
        : PRAYER2IDX[nextPrayer] - 1;
    const currentPrayerActualTime = prayerTimes[IDX2PRAYER[currentPrayerIdx]];

    const currentTime = new Date();
    const currHr = currentTime.getHours();
    const currMin = currentTime.getMinutes();
    const currSec = currentTime.getSeconds();

    const [currPrayerHr, currPrayerMin] = currentPrayerActualTime
      .split(":")
      .map((str) => parseInt(str, 10));

    let donePrayerDiff = {
      hr: currHr - currPrayerHr,
      min: currMin - currPrayerMin,
      sec: currSec,
    };

    // Adjust for negative minute difference
    if (donePrayerDiff.min < 0) {
      donePrayerDiff.hr -= 1; // Subtract 1 hour
      donePrayerDiff.min += 60; // Add 60 minutes
    }

    await axios.put(`${BACKEND_URL}/api/data/setUserPrayer`, {
      username,
      currentPrayerIdx,
      donePrayerDiff,
    });

    await axios.put(`${BACKEND_URL}/api/data/setUserStats`, {
      username,
      currentPrayerIdx,
    });
  }, [username, nextPrayer, prayerTimes, BACKEND_URL]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/data/getNameAndPrayerData?username=${username}`)
      .then((response) => response.json())
      .then((res) => setUserNameAndPrayerData(res));
  }, [username, setThisPrayerTime, setUserNameAndPrayerData, BACKEND_URL]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/data/getUserStatsData?username=${username}`)
      .then((response) => response.json())
      .then((res) => setUserStatsData(res));
  }, [username, setThisPrayerTime, setUserStatsData, BACKEND_URL]);

  // Empty dependency arrays to run the effect only once on mount
  useEffect(() => {
    window.addEventListener("PrePrayerReminder", (event) =>
      handlePrePrayerReminder(event.detail)
    );
    window.addEventListener("PostPrayerReminder", (event) =>
      handlePostPrayerReminder(event.detail)
    );

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("PrePrayerReminder", handlePrePrayerReminder);
      window.removeEventListener(
        "PostPrayerReminder",
        handlePostPrayerReminder
      );
    };
  }, []);

  return (
    <>
      <HeaderSection
        currentDate={currentDate}
        nextPrayer={nextPrayer}
        setNextPrayer={setNextPrayer}
        prayerTimes={prayerTimes}
        setPrayerTimes={setPrayerTimes}
        latitudeLongitudeData={latitudeLongitudeData}
        BACKEND_URL={BACKEND_URL}
      />
      <MiddleSection
        username={username}
        nextPrayer={nextPrayer}
        userNameAndPrayerData={userNameAndPrayerData}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
        handleLogout={handleLogout}
        BACKEND_URL={BACKEND_URL}
      />
      <BottomSection
        username={username}
        userStatsData={userStatsData}
        setUserStatsData={setUserStatsData}
        selectedFriendUsername={selectedFriend}
        BACKEND_URL={BACKEND_URL}
      />
      <PrayerButtonSection
        username={username}
        nextPrayer={nextPrayer}
        prayerTimes={prayerTimes}
        setThisPrayerTime={setThisPrayerTime}
      />
    </>
  );
};

export default Home;
