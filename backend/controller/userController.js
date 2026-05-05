const User = require("../models/User");
const bcrypt = require("bcrypt");
const createNotification = require("../utils/createNotification");


const getUserProfile = async(req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const editProfile = async (req , res)=>
{
  try {
      const { username, bio, avatar } = req.body;
      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar !== undefined) updateData.avatar = avatar;

      if (username) {
        const existingUser = await User.findOne({
          username,
        });

        if (existingUser && existingUser._id.toString() !== req.user.id) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }catch(err){
    res.status(500).json({message: "Internal server error"});
  }
}


const changePassword = async (req,res)=>{
  try{
    const { oldpassword , newpassword} = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldpassword , user.password);
    if(!isMatch) {
      return res.status(400).json({message: "Old password is incorrect"});
    }

    const hashedPassword = await bcrypt.hash(newpassword , 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({message: "Password changed successfully"});

  }catch(e){  
    res.status(500).json({message: "Internal server error"});
  }
}


const followUser = async (req,res)=>{
  try{

      if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(req.params.id);
      targetUser.followers.pull(req.user.id);
      await currentUser.save();
      await targetUser.save();
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user.id);
      await currentUser.save();
      await targetUser.save();
      await createNotification(
        targetUser._id,
        req.user.id,
        "follow"
      );
      res.status(200).json({ message: "Followed successfully" });
    }


  }catch(err){
    res.status(500).json({message: "Internal server error"});
  }
}


const getFollowers = async(req,res)=>{

 try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username avatar bio");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


const getFollowing = async(req,res)=>{

  try{
    const user = await User.findById(req.params.id)
    .populate("following", "username avatar bio");
    if(!user) return res.status(404).json({message: "User not found"});
    res.status(200).json(user.following);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}


const searchUsers = async (req, res) => {
  try {
    const query = req.query.query || "";
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("-password")
      .limit(20);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getUserProfile,
  editProfile,
  changePassword,
  followUser,
  getFollowers,
  getFollowing,
  searchUsers,
};
