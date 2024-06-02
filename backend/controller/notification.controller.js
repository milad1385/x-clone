import Notification from "../models/notifications.js";
export const getAllNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const userNotifications = await Notification.find({ to: userId })
      .sort({
        createdAt: -1,
      })
      .populate("from", "username email profileImg");

    return res.json(userNotifications);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const userNotifications = await Notification.find({ to: userId });

    if (!userNotifications) {
      return res.status(404).json({ msg: "notification not founded !!!" });
    }

    await Notification.deleteMany({ to: userId });

    return res.json({ msg: "notifications deleted successfully :)" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  const userId = req.user._id;
  const { notifId } = req.params;

  try {
    const notification = await Notification.findById(notifId);
    if (userId.toString() !== notification.to.toString()) {
      return res
        .status(403)
        .json({ msg: "you are unauthorized for delete notification" });
    }

    await Notification.findByIdAndDelete(notifId);

    return res.json({ msg: "notification deleted successFully :)" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
