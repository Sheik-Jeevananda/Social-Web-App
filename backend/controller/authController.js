const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async(req ,res)=>{
  try{
      const {username , email , password} = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
    );

    res.status(201).json({
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

  }catch(err){
    return res.status(500).json({ message: "Internal server error" });
  }
}


const Login = async(req,res)=>{
  try{
    const {username , password} = req.body;

    const user = await User.findOne({username});
    if(!user) return res.status(400).json({message: "Invalid username or password"});

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch) return res.status(400).json({message: "Invalid username or password"});

    const token = jwt.sign(
        { id: user._id },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
     );

    res.status(200).json({
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
    res.status(500).json({ message: err.message });
  }
}



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
