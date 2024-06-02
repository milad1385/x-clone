import express from "express";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPost,
  getUserLikePosts,
  getUserPosts,
  likeUnlikePost,
} from "../controller/post.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
import multerStorage from "../utils/multer.js";

const router = express.Router();

const upload = multerStorage("public/images/profiles");

router
  .route("/")
  .post(checkAuth, upload.array("images"), createPost)
  .get(getAllPosts);
router.post("/like/:id", checkAuth, likeUnlikePost);
router.delete("/delete/:id", checkAuth, deletePost);
router.post("/comment/:id", checkAuth, commentOnPost);
router.get("/likes/:id", getUserLikePosts);
router.get("/following", checkAuth, getFollowingPost);
router.get("/user/:username", getUserPosts);

export default router;
