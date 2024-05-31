import { isValidObjectId } from "mongoose";
import UserModel from "../models/users.js";
import NotificationModel from "../models/notifications.js";
import { checkUser } from "./../validator/user.js";
import { hashedPassword, verifyPassword } from "../utils/auth.js";
import { deletePic } from "../utils/multer.js";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(422).json({ msg: "please provide username " });
    }

    const userProfile = await UserModel.findOne({ username });
    if (!userProfile) {
      return res.status(404).json({ msg: "user is not founded :(" });
    }

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;

    const followingUsersByMe = await UserModel.findOne(
      { _id: userId },
      "following"
    );

    console.log(followingUsersByMe);

    const users = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const suggestedUser = await users.filter(
      (user) => !followingUsersByMe.following.includes(user._id)
    );
    console.log(suggestedUser);

    const slicedSuggested = suggestedUser.slice(0, 4);

    slicedSuggested.forEach((user) => (user.password = null));

    return res.json(slicedSuggested);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const followUnFollowUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id) || !id) {
    return res.status(422).json({ msg: "please send valid id " });
  }

  try {
    const userToModify = await UserModel.findById(id);
    const currUser = await UserModel.findById(req.user._id);

    const isFollowing = currUser.following.includes(id);

    if (isFollowing) {
      // handle unfollow user
      await UserModel.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });

      return res.json({ msg: "user unfollow successFully:)" });
    } else {
      // handle follow user
      await UserModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      await NotificationModel.create({
        from: currUser._id,
        to: userToModify._id,
        type: "follow",
      });

      return res.json({ msg: "user following successFully:)" });
    }
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let newHashedPassword = null;
    const { username, fullName, email, currPassword, newPassword, bio, link } =
      req.body;

    const isValid = await checkUser(req.body);

    if (isValid !== true) {
      return res.status(422).json(isValid);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "user is not founded" });
    }

    if (currPassword && newPassword) {
      const isValid = await verifyPassword(currPassword, user.password);
      if (!isValid) {
        return res.status(422).json({ msg: "curr password is in correct" });
      }

      newHashedPassword = await hashedPassword(newPassword);
    }

    const profileImage = req.files?.["userProfile"]?.[0]?.filename;
    const profileCover = req.files?.["profileCover"]?.[0]?.filename;

    if (profileImage) {
      if (user.profileImg) {
        deletePic(user.profileImg);
      }
    }

    if (profileCover) {
      if (user.coverImg) {
        deletePic(user.coverImg);
      }
    }

    const newInfo = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          username,
          email,
          password: newHashedPassword ? newHashedPassword : user.password,
          bio,
          link,
          fullName,
          profileImg: profileImage ? profileImage : user.profileImg,
          coverImg: profileCover ? profileCover : user.coverImg,
        },
      }
    );

    return res
      .status(200)
      .json({ msg: "user updated successfully:)", newInfo });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
