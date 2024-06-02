import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  deleteNotification,
  deleteNotifications,
  getAllNotifications,
} from "../controller/notification.controller.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, getAllNotifications)
  .delete(checkAuth, deleteNotifications);

router.delete("/:notifId", checkAuth, deleteNotification);

export default router;
