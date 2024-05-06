import styles from "../styles/PrayerButtonSection.module.css";

const PrayerButtonSection = ({ setThisPrayerTime }) => {
  return (
    <div
      className={styles["prayer-button-section"]}
      onClick={setThisPrayerTime}
    >
      <div className={styles["prayer-button-text"]}>I have done Salah</div>
    </div>
  );
};

export default PrayerButtonSection;
