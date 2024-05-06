import styles from "../styles/PrayerList.module.css";
import { PRAYER2IDX } from "../utilities/utils";

const PrayerList = ({ lastFivePrayers, nextPrayer, ownPrayers, handlePoke }) => {
  if (!lastFivePrayers) {
    return <>No Prayers To Show</>;
  }

  const prayers = [...lastFivePrayers];

  const nextPrayerIdx = PRAYER2IDX[nextPrayer];
  const numPrayers = prayers.length;
  const halfIdx = Math.floor(numPrayers / 2);


  if (nextPrayerIdx >= halfIdx) {
    const positionsToShiftUp = nextPrayerIdx - halfIdx;
    const topMostPrayers = prayers.slice(0, positionsToShiftUp);
    for (let i = positionsToShiftUp; i < numPrayers; i++) {
      prayers[i - positionsToShiftUp] = prayers[i];
    }
    for (let i = 0; i < topMostPrayers.length; i++) {
      prayers[numPrayers - halfIdx + i] = topMostPrayers[i];
    }

  } else {
    const positionsToShiftDown = halfIdx - nextPrayerIdx;
    const bottomMostPrayers = prayers.slice(
      numPrayers - positionsToShiftDown,
      numPrayers
    );
    for (let i = numPrayers - positionsToShiftDown - 1; i >= 0; --i) {
      prayers[i + positionsToShiftDown] = prayers[i];
    }
    for (let i = 0; i < bottomMostPrayers.length; i++) {
      prayers[i] = bottomMostPrayers[i];
    }
  }

  const prayersList = prayers.map((prayer, index) => {
    const { prayerName, prayerHr, prayerMin, prayerSec } = prayer;

    let prayerTime;

    if (index >= halfIdx) {
      prayerTime = "-- : -- : --";
    } else {
      const hrString = String(prayerHr).padStart(2, "0");
      const minString = String(prayerMin).padStart(2, "0");
      const secString = String(prayerSec).padStart(2, "0");

      prayerTime = `${hrString} : ${minString} : ${secString}`;
    }

    if (ownPrayers) {
      return (
        <div className={styles["own-prayer"]} key={prayerName}>
          <h2 className={styles["own-prayer-name"]}>{prayerName}</h2>
          <h3 className={styles["own-prayer-time"]}>{prayerTime}</h3>
        </div>
      );
    } else {
      return (
        <div className={styles["others-prayer"]} key={prayerName}>
          <h2 className={styles["others-prayer-name"]}>{prayerName}</h2>
          <h3 className={styles["others-prayer-time"]}>{prayerTime}</h3>
          <div className={styles["others-prayer-reminders"]}>
            <div className={styles["others-prayer-reminder-1"]}>
              <button onClick={handlePoke}>&spades;</button>
            </div>
            <div className={styles["others-prayer-reminder-2"]}>
              <button onClick={handlePoke}>&clubs;</button>
            </div>
          </div>
        </div>
      );
    }
  });

  return ownPrayers ? (
    <div className={styles["own-prayers"]}>{prayersList}</div>
  ) : (
    <div className={styles["others-prayers"]}>{prayersList}</div>
  );
};

export default PrayerList;
