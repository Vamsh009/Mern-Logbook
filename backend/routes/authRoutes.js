import express from "express";
import User from "../models/Users.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({
      $or: [{ useremail: email }, { username }]
    });
    if (existingUser) {
      const message = existingUser.useremail === email
        ? "Email already exists"
        : "Username already exists";
      return res.status(400).json({ message });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, useremail: email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.useremail
      },
      token: token
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const message = duplicateField === "username"
        ? "Username already exists"
        : "Email already exists";
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error" });
  }

});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const user = await User.findOne({
      $or: [{ useremail: email }, { email }]
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },

    )
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.useremail || user.email
      },
      token: token
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.useremail
      }
    });
  } catch (error) {
    console.error("Error in get user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
