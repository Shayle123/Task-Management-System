const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { readData, writeData } = require("../utils/fileHandler");

const USERS_FILE = "./data/users.json";
const SECRET = process.env.JWT_SECRET || "mysecretkey";

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    let users = readData(USERS_FILE);

    const existingUser = users.find(
      (u) => u.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // safe role control
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeData(USERS_FILE, users);

    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    let users = readData(USERS_FILE);

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;