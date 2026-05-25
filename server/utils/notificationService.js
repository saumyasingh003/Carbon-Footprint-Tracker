import Notification
from "../models/notification.js";

export const createNotification =
async ({
  user,
  title,
  message,
  type = "ai",
  link = "",
}) => {

  try {

    await Notification.create({
      user,
      title,
      message,
      type,
      link,
    });

  } catch (error) {

    console.log(
      "Notification Error:",
      error.message
    );
  }
};