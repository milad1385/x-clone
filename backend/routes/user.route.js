import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import multerStorage from "../utils/multer.js";
import {
  followUnFollowUser,
  getProfile,
  getSuggestions,
  updateProfile,
} from "../controller/user.controller.js";
const router = express.Router();

const upload = multerStorage("public/images/profiles");

router.post("/profile/:username", getProfile);
router.get("/suggestios", checkAuth, getSuggestions);
router.post("/follow/:id", checkAuth, followUnFollowUser);
router.put(
  "/update",
  checkAuth,
  upload.fields([
    { name: "userProfile", maxCount: 1 },
    { name: "profileCover", maxCount: 1 },
  ]),
  updateProfile
);

export default router;
