import crypto from "crypto";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },

  job: {
    type: String,
    required: true
  },

  distintive: {
    type: String,
    required: true
  },

  writer: {
    type: String,
    required: true
  },

  role: {
    type: Number,
    required: true,
    select: true
  },

  base_prompt: {
    type: String,
    required: false,
    select: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  salt: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamp: true
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
  return this.password === hash;
};

const User = mongoose.model("User", userSchema);
export default User;