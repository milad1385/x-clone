import express from "express";
import {
  getMe,
  logout,
  signin,
  signup,
} from "../controller/auth.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/getMe", checkAuth, getMe);

export default router;
