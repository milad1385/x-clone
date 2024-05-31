import { verifyAccessToken } from "../utils/auth.js";
import UserModel from "../models/users.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "user is unauthorized , please login" });
    }

    const decodedToken = verifyAccessToken(token);

    if (!decodedToken) {
      return res
        .status(401)
        .json({ msg: "user is unauthorized , please login" });
    }

    const user = await UserModel.findOne({ _id: decodedToken.userId });

    if (!user) {
      return res.status(404).json({ msg: "username is not founded" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ err: "internal err" });
  }
};
