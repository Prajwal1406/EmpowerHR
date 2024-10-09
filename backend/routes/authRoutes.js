const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedpassword = await bycrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedpassword });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Error registering user",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bycrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "secretKey");
      res.json({ token });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;
