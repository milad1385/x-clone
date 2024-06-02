import mongoose from "mongoose";

const schema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
      },
    },
  ],
});

const model = mongoose.model("Post", schema);

export default model;
