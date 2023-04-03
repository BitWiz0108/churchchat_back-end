import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userRegister = async (req, res) => {
  try {
    const { username, password, email, str1, str2, str3, role } = req.body;
    const checkUser = await User.findOne({ username });
    if (checkUser) return res.status(400).json({
      message: "username already used"
    });
    const user = new User({ username });
    user.setPassword(password);
    user.email = email;
    user.job = str1;
    user.distintive = str2;
    user.writer = str3;
    user.role = role;
    user.base_prompt = "Please ignore our previous conversations and let us start a fresh conversation here. And I am interested in joining your bible study group. ";
    await user.save();
    res.status(201).json({});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const userSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("username password salt id job distintive writer role, base_prompt");
    if (!user) return res.status(400).json({
      message: "User not found"
    });
    if (!user.validPassword(password)) return res.status(400).json({
      message: "Wrong password"
    });
    const token = jwt.sign(
      { data: user._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24H" }
    );
    res.status(200).json({
      token,
      username,
      id: user._id,
      job: user.job,
      distinctive: user.distintive,
      writer: user.writer,
      role: user.role,
      base_prompt: user.base_prompt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    const usersData = user.map((user, index) => {
      return {
        ...user,
        key: index
      };
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBasePrompt = async (req, res) => {
  try {
    const updatedPrompt = req.body.text;
    const users = await User.find();
    users.forEach((user) => {
      User.findOneAndUpdate(
        { _id: user._id },
        { $set: { base_prompt: updatedPrompt } },
        { new: true },
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};