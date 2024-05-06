import styles from "../styles/Pills.module.css";

const Pills = ({
  ownNamePill,
  name,
  names,
  setSelectedFriend,
  handleLogout,
  selectedFriend,
}) => {
  if (name === undefined && names === undefined) {
    return <></>;
  }

  const friendsNameList = ownNamePill ? (
    <></>
  ) : (
    names.map(({ username, name }) => {
      return (
        <div
          className={`${styles["others-prayer-pill"]} ${
            selectedFriend === username ? styles["selected-pill"] : ""
          }`}
          key={username}
          onClick={() => setSelectedFriend(username)}
        >
          <h5 className={styles["others-name"]}>{name}</h5>
        </div>
      );
    })
  );

  return ownNamePill ? (
    <div className={styles["own-prayer-pill-container"]}>
      <div
        className={`${styles["own-prayer-pill"]} ${styles["selected-pill"]}`}
        onClick={handleLogout}
      >
        <h5 className={styles["own-name"]}>{name}</h5>
      </div>
    </div>
  ) : (
    <div className={styles["others-prayer-pill-container"]}>{friendsNameList}</div>
  );
};

export default Pills;
