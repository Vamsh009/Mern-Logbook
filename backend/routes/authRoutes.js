import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import Note from "../models/Note.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const TOKEN_EXPIRES_IN = "7d";

const normalizeEmail = (email) => {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
};

const normalizeUsername = (username) => {
  return typeof username === "string" ? username.trim() : "";
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
};

const toAuthUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.useremail,
  avatarUrl: user.avatarUrl || ""
});

const sendAuthResponse = async (res, statusCode, user) => {
  const token = createToken(user);
  const noteCount = await Note.countDocuments({ user: user._id });

  return res.status(statusCode).json({
    user: {
      ...toAuthUser(user),
      noteCount
    },
    token
  });
};

const duplicateMessage = (error) => {
  const duplicateField = Object.keys(error.keyPattern || error.keyValue || {})[0];

  if (duplicateField === "username") {
    return "Username already exists";
  }

  return "Email already exists";
};

router.post("/register", async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { useremail: email }]
    });

    if (existingUser) {
      const message = existingUser.useremail === email
        ? "Email already exists"
        : "Username already exists";

      return res.status(400).json({ message });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      useremail: email,
      password: hashedPassword
    });

    return await sendAuthResponse(res, 201, user);
  } catch (error) {
    console.error("Error in user registration:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: duplicateMessage(error) });
    }

    if (error.message === "JWT_SECRET is not configured") {
      return res.status(500).json({ message: "Server configuration error" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ useremail: email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return await sendAuthResponse(res, 200, user);
  } catch (error) {
    console.error("Error in user login:", error);

    if (error.message === "JWT_SECRET is not configured") {
      return res.status(500).json({ message: "Server configuration error" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const noteCount = await Note.countDocuments({ user: req.user._id });

  return res.status(200).json({
    user: {
      ...toAuthUser(req.user),
      noteCount
    }
  });
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const avatarUrl = typeof req.body.avatarUrl === "string" ? req.body.avatarUrl.trim() : "";

    if (avatarUrl && !avatarUrl.startsWith("data:image/")) {
      return res.status(400).json({ message: "Profile picture must be an image" });
    }

    if (avatarUrl.length > 100000) {
      return res.status(400).json({ message: "Profile picture is too large" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    const noteCount = await Note.countDocuments({ user: req.user._id });

    return res.status(200).json({
      user: {
        ...toAuthUser(user),
        noteCount
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
