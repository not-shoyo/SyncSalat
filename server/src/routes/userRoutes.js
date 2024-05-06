const express = require("express");

const UserModel = require("../../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new UserModel({ username, password });

  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("In /login in Server:");
  console.log(`username: ${username}, password: ${password}`);

  try {
    const user = await UserModel.findOne({ username, password });
    console.log(user);
    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
