import mongoose from "mongoose";

const schema = mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["follow", "like"],
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model("Notification", schema);

export default model;
