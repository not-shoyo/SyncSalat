import { useEffect, useState } from "react";
import io from "socket.io-client";

import PrayerList from "./PrayerList";
import Pills from "./Pills";

import styles from "../styles/MiddleSection.module.css";

const MiddleSection = ({
  username,
  nextPrayer,
  userNameAndPrayerData,
  selectedFriend,
  setSelectedFriend,
  handleLogout,
  BACKEND_URL,
}) => {
  const [friendsNameAndPrayerData, setFriendsNameAndPrayerData] =
    useState(undefined);
  const [socket, setSocket] = useState(null);

  let name = "";
  let lastFivePrayers = [];

  if (userNameAndPrayerData !== undefined) {
    name = userNameAndPrayerData.name;
    lastFivePrayers = userNameAndPrayerData.lastFivePrayers;
  }

  const friendsNameAndPrayers = {};
  let names = [];

  if (friendsNameAndPrayerData !== undefined) {
    for (const i in friendsNameAndPrayerData) {
      const { username, name, lastFivePrayers } = friendsNameAndPrayerData[i];
      friendsNameAndPrayers[username] = { username, name, lastFivePrayers };
      names.push({ username, name });
    }
  }

  useEffect(() => {
    fetch(
      `${BACKEND_URL}/api/data/getFriendsNameAndPrayerData?username=${username}`
    )
      .then((response) => response.json())
      .then((res) => setFriendsNameAndPrayerData(res));
  }, [username, setFriendsNameAndPrayerData, BACKEND_URL]);

  useEffect(() => {
    if (friendsNameAndPrayerData !== undefined) {
      setSelectedFriend(friendsNameAndPrayerData[0].username);
    }
  }, [friendsNameAndPrayerData, setSelectedFriend]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (data) => {
      if (data.receiver === username) {
        alert(`Message from ${data.sender}: ${data.content}`);
      }
    });

    // Cleanup socket on component unmount
    return () => {
      socket.off("message");
    };
  }, [socket, username]);

  useEffect(() => {
    console.log("setting up newSocketConnection");

    const newSocket = io(`${BACKEND_URL}`);
    setSocket(newSocket);

    console.log("socketConnection Set");

    // Cleanup socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [BACKEND_URL]);

  const sendPoke = () => {
    console.log("In sendPoke()");

    const message = {
      sender: username,
      receiver: selectedFriend,
      content: "Please pray!",
    };

    socket.emit("message", message);
  };

  if (friendsNameAndPrayers[selectedFriend] === undefined) {
    return <></>;
  }

  return (
    <div className={styles["middle-section"]}>
      <section className={styles["own-prayers-section"]}>
        <Pills ownNamePill={true} name={name} handleLogout={handleLogout} />
        <PrayerList
          lastFivePrayers={lastFivePrayers}
          nextPrayer={nextPrayer}
          ownPrayers={true}
        />
      </section>
      <section className={styles["others-prayers-section"]}>
        <Pills
          ownNamePill={false}
          names={names}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
        />
        <PrayerList
          lastFivePrayers={
            friendsNameAndPrayers[selectedFriend].lastFivePrayers
          }
          nextPrayer={nextPrayer}
          ownPrayers={false}
          handlePoke={sendPoke}
        />
      </section>
    </div>
  );
};

export default MiddleSection;
