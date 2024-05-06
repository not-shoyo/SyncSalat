import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getLatitudeAndLongitudeFromURL } from "../utilities/utils";

const Login = ({ onLogin, BACKEND_URL }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { latitude, longitude } = getLatitudeAndLongitudeFromURL(window);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate(`/home?latitude=${latitude}&longitude=${longitude}`);
    }
  }, [navigate, latitude, longitude]);

  const handleLogin = async () => {
    console.log(`BACKEND_URL: ${BACKEND_URL}`);
    try {
      await axios.post(`${BACKEND_URL}/api/user/login`, {
        username,
        password,
      });
      console.log("Login successful");
      localStorage.setItem("loggedInUser", username);
      onLogin(username);
      navigate(`/home?latitude=${latitude}&longitude=${longitude}`);
    } catch (error) {
      console.log(error);
      console.error(`Login failed`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
