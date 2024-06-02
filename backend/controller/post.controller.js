import { isValidObjectId } from "mongoose";
import PostModel from "./../models/post.js";
import UserModel from "./../models/users.js";
import NotificationModel from "../models/notifications.js";
import { deletePic } from "../utils/multer.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const images = req.files.map((file) => file.filename);

    if (!text || !images.length) {
      return res.status(422).json({ msg: "please enter valid value" });
    }

    const post = await PostModel.create({
      user: req.user._id,
      text,
      images,
    });

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .populate("user comments.user", "username profileImg");

    return res.json(allPosts);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ msg: "please enter valid value" });
  }

  try {
    const post = await PostModel.findOne({ _id: id });

    if (!post) {
      return res.status(404).json({ msg: "post is not founded !!!" });
    }

    const isLike = post.likes.includes(req.user._id);

    if (isLike) {
      // handle unlike post
      await PostModel.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            likes: req.user._id,
          },
        }
      );

      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            likedPost: post._id,
          },
        }
      );

      return res.json({ msg: "post unliked successfully :)" });
    } else {
      // handle like post
      await PostModel.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            likes: req.user._id,
          },
        }
      );

      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            likedPost: post._id,
          },
        }
      );

      await NotificationModel.create({
        from: req.user._id,
        to: post.user,
        type: "like",
      });

      return res.json({ msg: "post liked successfully :)" });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ msg: "please enter valid value" });
  }

  try {
    const post = await PostModel.findOne({ _id: id }).lean();

    if (!post) {
      return res.status(404).json({ msg: "post is not founded !!!" });
    }

    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(404)
        .json({ msg: "you are not authorized to delete this post" });
    }

    if (post.images) {
      post.images.forEach((image) => {
        deletePic(image);
      });
    }
    await PostModel.findOneAndDelete({ _id: id });

    return res.json({ msg: "post deleted successFully:)" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const commentOnPost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ msg: "please enter valid value" });
  }

  const { text } = req.body;
  if (text.length < 3) {
    return res.status(422).json({ msg: "please enter valid value" });
  }
  try {
    const post = await PostModel.findOne({ _id: id });
    if (!post) {
      return res.status(404).json({ msg: "post is not founded !!!" });
    }

    const comment = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          comments: {
            text,
            user: req.user._id,
          },
        },
      }
    );

    return res.json({ msg: "comment created successFully:)" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

export const getUserLikePosts = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ msg: "please enter valid value" });
  }

  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ msg: "user not founded !!!" });
  }

  try {
    const likedPost = await PostModel.find({
      _id: { $in: user.likedPost },
    })
      .sort({ createdAt: -1 })
      .populate("user comments.user", "username profileImg");

    return res.json(likedPost);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const followingUsersPosts = await PostModel.find({
      user: { $in: req.user.following },
    })
      .sort({ createdAt: -1 })
      .populate("user comments.user", "username profileImg");

    return res.json(followingUsersPosts);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(422).json({ msg: "please enter valid value" });
  }

  try {
    const user = await UserModel.findOne({ username });
    const userPosts = await PostModel.find({ user: user._id });

    return res.json(userPosts);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
