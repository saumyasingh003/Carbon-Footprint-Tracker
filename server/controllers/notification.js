import Notification
from "../models/notification.js";


// GET NOTIFICATIONS

export const getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        user: req.user._id,
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// MARK AS READ

export const markAsRead =
async (req, res) => {

  try {

    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {

      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Marked as read",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET UNREAD COUNT

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// MARK ALL AS READ

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// MARK BY TYPE AS READ

export const markReadByType = async (req, res) => {
  try {
    const { type } = req.params;
    await Notification.updateMany(
      { user: req.user._id, type, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: `Notifications of type ${type} marked as read`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};