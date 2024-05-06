import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { getLatitudeAndLongitudeFromURL } from "../utilities/utils";

const Register = ({ BACKEND_URL }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { latitude, longitude } = getLatitudeAndLongitudeFromURL(window);

  const handleRegister = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/user/register`, {
        username,
        password,
      });
      console.log("User registered successfully");
      navigate(`/login?latitude=${latitude}&longitude=${longitude}`);
    } catch (error) {
      console.error("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
