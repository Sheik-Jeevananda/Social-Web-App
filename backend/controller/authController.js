const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    // check for existing username or email
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
      },
    });
  } catch (err) {
    // handle Mongo duplicate key error with a friendlier message
    if (err.code === 11000 && err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};


const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};



const getMe = async(req,res)=>{
  try{
    const user = await User.findById(req.user.id).select("-password");
    if(!user) return res.status(404).json({message: "User not found"});

    res.status(200).json({user});
  }
  catch(err){
    res.status(500).json({message: "Internal server error"});
  }
}


module.exports = {register ,Login , getMe};
