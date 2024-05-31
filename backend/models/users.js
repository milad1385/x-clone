import mongoose from "mongoose";

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],

  following: [{ type: mongoose.Types.ObjectId, ref: "User" }],

  profileImg: {
    type: String,
    default: "",
  },
  coverImg: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
  },
});

const model = mongoose.model("User", schema);

export default model;
