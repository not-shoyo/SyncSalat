export const PRAYER_NAME_MAPPING = {
  Subihi: "Subihi",
  Luhr: "Luhr",
  Asr: "Asr",
  Magrib: "Magrib",
  "Isha'a": "Isha'a",
  Fajr: "Subihi",
  Dhuhr: "Luhr",
  Maghrib: "Magrib",
  Isha: "Isha'a",
};

export const PRAYER2IDX = {
  Subihi: 0,
  Luhr: 1,
  Asr: 2,
  Magrib: 3,
  "Isha'a": 4,
};

export const IDX2PRAYER = {
  0: "Subihi",
  1: "Luhr",
  2: "Asr",
  3: "Magrib",
  4: "Isha'a",
};

export const getCurrentDate = () => {
  const todaysDate = new Date();
  const dateMap = {
    fullDate: todaysDate,
    year: todaysDate.getFullYear(),
    month: todaysDate.getMonth() + 1,
    date: todaysDate.getDate(),
    shortYear: todaysDate.getFullYear().toString().slice(-2),
  };
  return dateMap;
};

export const occursAfter = (time, date) => {
  if (time === undefined) {
    console.log("undefined time from occursAfter");
    return;
  }

  const [hrs, mins] = time.split(":").map(Number);
  const begDate = new Date();
  begDate.setHours(hrs);
  begDate.setMinutes(mins);

  return begDate >= date;
};

export const calcDifference = (time, date, sameDay) => {
  if (time === undefined) {
    console.log("undefined time from calcDifference");
    return;
  }

  const [hrs, mins] = time.split(":").map(Number);

  let timeDifference = 0;

  if (sameDay) {
    const newDate = new Date(date);
    newDate.setHours(hrs, mins, 0, 0);
    timeDifference = newDate.getTime() - date.getTime();
  } else {
    const nextDate = new Date(date);
    nextDate.setHours(hrs, mins, 0, 0);

    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate.getDate() === 1) {
      nextDate.setMonth(nextDate.getMonth() + 1);
      if (nextDate.getMonth() === 0) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      nextDate.setDate(1);
    }

    const middlePoint = new Date(date);
    middlePoint.setHours(0, 0, 0, 0);

    const timeDifferenceSameDay = middlePoint.getTime() - date.getTime();
    const timeDifferenceNextDay = nextDate.getTime() - middlePoint.getTime();

    timeDifference = timeDifferenceSameDay + timeDifferenceNextDay;
  }

  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  const formattedHours = String(hoursDifference).padStart(2, "0");
  const formattedMinutes = String(minutesDifference).padStart(2, "0");

  return `${formattedHours} : ${formattedMinutes}`;
};

export const yetToCome = (currentTimeString) => {
  const currentTime = new Date();

  const [hours, minutes] = currentTimeString.split(":");
  const compareTime = new Date();
  compareTime.setHours(parseInt(hours, 10));
  compareTime.setMinutes(parseInt(minutes, 10));

  return currentTime <= compareTime;
};

export const calculateTimeDifference = (
  startTime,
  endTime,
  currentDate,
  endIsNextDay
) => {
  const { date, month, year } = currentDate;
  const todaysDate = `${year}-${month}-${date}`;

  console.log(todaysDate);

  const startDate = new Date(startTime);
  const endDate = new Date();
  console.log(endTime);

  console.log(startDate);
  console.log(endDate);

  let hours = 0;
  let minutes = 0;

  if (endIsNextDay) {
    console.log("welp");
  } else {
    const timeDifference = endDate - startDate;

    console.log(timeDifference);

    const totalMinutes = Math.floor(timeDifference / 60000);

    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;
  }

  return `${hours}, ${minutes}`;
};

export const updateNextPrayerDetails = (
  newPrayerTimings,
  currentDate,
  setNextPrayer,
  setTimeToNextPrayer
) => {
  let nextPrayer = "";

  for (const prayer in newPrayerTimings) {
    if (yetToCome(newPrayerTimings[prayer])) {
      nextPrayer = prayer;
      break;
    }
  }

  if (nextPrayer === "") {
    setNextPrayer("Subihi");
    setTimeToNextPrayer(
      calculateTimeDifference(new Date(), newPrayerTimings["Subihi"], currentDate, true)
    );
  } else {
    setNextPrayer(nextPrayer);
    setTimeToNextPrayer(
      calculateTimeDifference(
        new Date(),
        new Date(newPrayerTimings[nextPrayer]),
        currentDate,
        false
      )
    );
  }
};

export const getLatitudeAndLongitudeFromURL = (window) => {
  const urlParams = new URLSearchParams(window.location.search);
  let latitude = urlParams.get("latitude");
  let longitude = urlParams.get("longitude");

  // hardcoding latitude longitude
  if (latitude === null || longitude === null) {
    latitude = 13.0070921;
    longitude = 74.7953611;
  }
  return { latitude, longitude };
};

export const handlePrePrayerReminder = ({ message }) => {
  console.log("From Home: PrePrayerReminder: time for the next prayer!");
  window.alert(`${message}`);
};

export const handlePostPrayerReminder = ({ message }) => {
  console.log("From Home: PostPrayerReminder: 15 minutes since the last prayer!");
  window.alert(`${message}`);
};
