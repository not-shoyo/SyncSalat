import styles from "../styles/StatsBlock.module.css";

const StatsBlock = ({ ownStats, userStatsData }) => {
  if (userStatsData === undefined) {
    console.log(
      `undefined userStatsData from StatBlock with ownstats: ${ownStats}`
    );
    return <></>;
  }

  if (
    userStatsData.daysStats === undefined ||
    userStatsData.prayersStats === undefined
  ) {
    console.log(
      `undefined daysStats or prayersStats from StatBlock with ownstats: ${ownStats}`
    );
    return <></>;
  }

  return (
    <section className={styles["stats-section"]}>
      <h6 className={styles["streaks-heading"]}>
        {ownStats ? "Your" : userStatsData.name + "'s"} Streaks
      </h6>
      <div className={styles["stats-row"]}>
        <div className={styles["stats-days"]}>
          <h5 className={styles["stat-title"]}>Days</h5>
          <div className={styles["stat-group"]}>
            <div className={styles["visualization-current"]}>
              <div className={styles["stat-val"]}>
                {userStatsData.daysStats.current}
              </div>
            </div>
            <div className={styles["visualization-best"]}>
              <div className={styles["stat-val"]}>
                {userStatsData.daysStats.best}
              </div>
            </div>
            <div className={styles["stat-state"]}>Current</div>
            <div className={styles["stat-state"]}>Best</div>
          </div>
        </div>
        <div className={styles["stats-prayers"]}>
          <h5 className={styles["stat-title"]}>Prayers</h5>
          <div className={styles["stat-group"]}>
            <div className={styles["visualization-current"]}>
              <div className={styles["stat-val"]}>
                {userStatsData.prayersStats.current}
              </div>
            </div>
            <div className={styles["visualization-best"]}>
              <div className={styles["stat-val"]}>
                {userStatsData.prayersStats.best}
              </div>
            </div>
            <div className={styles["stat-state"]}>Current</div>
            <div className={styles["stat-state"]}>Best</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBlock;
