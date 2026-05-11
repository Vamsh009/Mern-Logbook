import express from "express";
import User from "../models/Users.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ useremail: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
    res.status(500).json({ message: "Server error" });
  }

});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const user = await User.findOne({ useremail: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const isPasswaordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswaordValid) {
      return res.status(400).json({ message: "Invalid credentials" })
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
        email: user.useremail
      },
      token: token
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async(req,res)=> {
  try{
    res.status(200).json({
      user:{
        id: req.user._id,
        username: req.user.username,
        email: req.user.useremail
      } 
    });
  }catch(error){
    console.error("Error in get user details:", error);
    res.status(500).json({message:"Server error"});
  }
});


export default router;