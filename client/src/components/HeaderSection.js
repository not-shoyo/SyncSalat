import { useCallback, useEffect, useState } from "react";

import styles from "../styles/HeaderSection.module.css";
import {
  IDX2PRAYER,
  PRAYER_NAME_MAPPING,
  occursAfter,
  calcDifference,
  PRAYER2IDX,
} from "../utilities/utils";

const HeaderSection = ({
  currentDate,
  nextPrayer,
  setNextPrayer,
  prayerTimes,
  setPrayerTimes,
  latitudeLongitudeData,
  BACKEND_URL,
}) => {
  console.log("HeaderSection.js rendered");

  const [prayerTimesData, setPrayerTimesData] = useState({});
  const [timeToNextPrayer, setTimeToNextPrayer] = useState("");
  const [remindersShown, setRemindersShown] = useState({
    prePrayerReminder: false,
    postPrayerReminder: false,
  });

  const [preHours, preMinutes] = [0, 5];
  const [postHours, postMinutes] = [0, 15];

  const preReminderThresholdTime = (preHours * 60 + preMinutes) * 60 * 1000;
  const postReminderThresholdTime = (postHours * 60 + postMinutes) * 60 * 1000;

  const fetchPrayerTimesData = useCallback(
    async (currentDate, latitude, longitude) => {
      const currentDateString = `${currentDate.date}-${currentDate.month}-${currentDate.year}`;
      const apiUrl = `${BACKEND_URL}/api/data/getPrayerTimes?currentDate=${currentDateString}&latitude=${latitude}&longitude=${longitude}`;

      console.log(`apiUrl: ${apiUrl}`);

      try {
        console.warn("calling getPrayerTimes");
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("setting prayerTimesData");
        setPrayerTimesData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [BACKEND_URL]
  );

  const isValidDate = (date) => date !== undefined;

  const isValidCoordinates = (latitude, longitude) =>
    latitude !== undefined && longitude !== undefined;

  useEffect(() => {
    if (!isValidDate(currentDate)) return;

    const isValidLocation = isValidCoordinates(
      latitudeLongitudeData.latitude,
      latitudeLongitudeData.longitude
    );

    if (!isValidLocation) {
      console.log("Invalid latitude or longitude from latitudeLongitudeData");
      return;
    }

    fetchPrayerTimesData(
      currentDate,
      latitudeLongitudeData.latitude,
      latitudeLongitudeData.longitude
    );
  }, [
    nextPrayer,
    currentDate,
    latitudeLongitudeData,
    setPrayerTimesData,
    fetchPrayerTimesData,
  ]);

  useEffect(() => {
    const newPrayerTimes = {};

    for (const key in prayerTimesData) {
      if (!(key in PRAYER_NAME_MAPPING)) continue;
      newPrayerTimes[PRAYER_NAME_MAPPING[key]] = prayerTimesData[key];
    }

    setPrayerTimes(newPrayerTimes);
  }, [prayerTimesData, setPrayerTimes]);

  // useEffect(() => {
  //   console.log(nextPrayer);
  // }, [nextPrayer]);

  // useEffect(() => {
  //   console.log(timeToNextPrayer);
  // }, [timeToNextPrayer]);

  useEffect(() => {
    const closeToPrayer = (
      prayerTime,
      currentTime,
      threshold,
      isBeforePrayer
    ) => {
      if (prayerTime === undefined) return false;

      const prayerDateTime = new Date(currentTime);
      const [hours, minutes] = prayerTime.split(":").map(Number);
      prayerDateTime.setHours(hours, minutes, 0, 0);
      const timeDifference = isBeforePrayer
        ? prayerDateTime.getTime() - currentTime.getTime()
        : currentTime.getTime() - prayerDateTime.getTime();
      return timeDifference <= threshold;
    };

    const handleEmittingReminder = (
      isPreReminder,
      prayerTime,
      currentTime,
      threshold
    ) => {
      const reminderEvent = isPreReminder
        ? "PrePrayerReminder"
        : "PostPrayerReminder";
      const reminderKey = isPreReminder
        ? "prePrayerReminder"
        : "postPrayerReminder";

      if (!remindersShown[reminderKey]) {
        if (closeToPrayer(prayerTime, currentTime, threshold, isPreReminder)) {
          const reminderMessage = isPreReminder
            ? `Less than ${preMinutes} minutes left till your next prayer!`
            : `${postMinutes} minutes over since your last prayer!`;

          window.dispatchEvent(
            new CustomEvent(reminderEvent, {
              detail: {
                message: reminderMessage,
              },
            })
          );
          setRemindersShown((prevState) => ({
            ...prevState,
            [reminderKey]: true,
          }));
        }
      }
    };

    const intervalId = setInterval(() => {
      let nextPrayerIsSubihi = true;

      for (const i in IDX2PRAYER) {
        const prayerName = IDX2PRAYER[i];
        const prayerTime = prayerTimes[prayerName];
        const currentTime = new Date();

        if (occursAfter(prayerTime, currentTime)) {
          setNextPrayer(prayerName);
          setTimeToNextPrayer(calcDifference(prayerTime, currentTime, true));

          handleEmittingReminder(
            true,
            prayerTime,
            currentTime,
            preReminderThresholdTime
          );

          if (i !== 0) {
            const previousPrayerTime =
              prayerTimes[IDX2PRAYER[PRAYER2IDX[prayerName] - 1]];
            handleEmittingReminder(
              false,
              previousPrayerTime,
              currentTime,
              postReminderThresholdTime
            );
          }

          nextPrayerIsSubihi = false;
          break;
        }
      }

      if (nextPrayerIsSubihi) {
        const prayerName = IDX2PRAYER[0];
        const numPrayers = Object.keys(PRAYER2IDX).length;
        const prayerTime = prayerTimes[prayerName];
        const previousPrayerTime = prayerTimes[IDX2PRAYER[numPrayers - 1]];

        setNextPrayer(prayerName);
        setTimeToNextPrayer(calcDifference(prayerTime, new Date(), false));

        handleEmittingReminder(
          false,
          previousPrayerTime,
          new Date(),
          postReminderThresholdTime
        );
      }
    }, 30000); // Update every few portions of a minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [
    prayerTimes,
    setNextPrayer,
    remindersShown,
    setTimeToNextPrayer,
    setRemindersShown,
    preReminderThresholdTime,
    postReminderThresholdTime,
    preMinutes,
    postMinutes,
  ]);

  return (
    <div className={styles["header-section"]}>
      <div className={styles["prayer-name-section"]}>
        <h2 className={styles["prayer-precursor-text"]}>Time Left Until</h2>
        <h1 className={styles["prayer-name"]}>{nextPrayer}</h1>
      </div>
      <div className={styles["prayer-time-section"]}>
        <div className={styles["prayer-time-titles"]}>
          <h4>Hrs</h4>
          <h4>Mins</h4>
        </div>
        <h2 className={styles["prayer-time"]}>{timeToNextPrayer}</h2>
      </div>
    </div>
  );
};

export default HeaderSection;
