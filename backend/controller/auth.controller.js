import { checkSignIn, checkSignUp } from "../validator/auth.js";
import UserModel from "../models/users.js";
import {
  generateAccessToken,
  hashedPassword,
  verifyPassword,
} from "../utils/auth.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const isValid = await checkSignUp(req.body);

    if (isValid !== true) {
      return res.status(422).json(isValid);
    }

    const isUserExist = await UserModel.findOne({
      $or: [{ email, username }],
    });

    if (isUserExist) {
      return res.status(400).json({ msg: "user is already exits :(" });
    }

    const usersCount = await UserModel.countDocuments();

    const hashPassword = await hashedPassword(password);

    const user = await UserModel.create({
      username,
      email,
      fullName,
      password: hashPassword,
      role: usersCount > 0 ? "USER" : "ADMIN",
    });

    generateAccessToken({ userId: user._id }, res);

    return res.status(201).json({ msg: "user registerd successfully:)", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: "internal err" });
  }
};

export const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const isValid = await checkSignIn(req.body);

    if (isValid !== true) {
      return res.status(422).json(isValid);
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).lean();

    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "username or password is incorrect" });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(404).json({ msg: "username or password is incorrect" });
    }

    generateAccessToken({ userId: user._id }, res);

    return res.status(200).json({ msg: "user login successFully:)", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: "internal err" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 0,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ err: "internal err" });
  }
};
