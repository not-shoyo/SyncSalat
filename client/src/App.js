// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import {
  getCurrentDate,
  getLatitudeAndLongitudeFromURL,
} from "./utilities/utils";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "https://localhost:3001";

console.log(BACKEND_URL);

function App() {
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [latitudeLongitudeData, setLatitudeLongitudeData] = useState("");

  console.log(`App.js rendered with username: ${username}`);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUsername(loggedInUser);
      setCurrentDate(getCurrentDate());
      setLatitudeLongitudeData(getLatitudeAndLongitudeFromURL(window));
    }
  }, []);

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setCurrentDate(getCurrentDate());
    setLatitudeLongitudeData(getLatitudeAndLongitudeFromURL(window));
    localStorage.setItem("loggedInUser", loggedInUsername);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<Register BACKEND_URL={BACKEND_URL} />}
        ></Route>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} BACKEND_URL={BACKEND_URL} />}
        ></Route>
        <Route
          path="/home"
          element={
            <Home
              username={username}
              currentDate={currentDate}
              latitudeLongitudeData={latitudeLongitudeData}
              BACKEND_URL={BACKEND_URL}
            />
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
