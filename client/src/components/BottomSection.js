import { useEffect, useState } from "react";

import StatsBlock from "./StatsBlock";

import styles from "../styles/BottomSection.module.css";

const BottomSection = ({
  userStatsData,
  selectedFriendUsername,
  BACKEND_URL,
}) => {
  const [friendsStatsData, setFriendsStatsData] = useState();

  useEffect(() => {
    if (selectedFriendUsername !== "") {
      fetch(
        `${BACKEND_URL}/api/data/getUserStatsData?username=${selectedFriendUsername}`
      )
        .then((response) => response.json())
        .then((res) => setFriendsStatsData(res));
    }
  }, [selectedFriendUsername, setFriendsStatsData, BACKEND_URL]);

  return (
    <div className={styles["bottom-section"]}>
      <StatsBlock ownStats={true} userStatsData={userStatsData} />
      {selectedFriendUsername === "" ? (
        <></>
      ) : (
        <StatsBlock ownStats={false} userStatsData={friendsStatsData} />
      )}
    </div>
  );
};

export default BottomSection;
