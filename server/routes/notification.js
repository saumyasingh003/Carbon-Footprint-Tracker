import express from "express";
import { getNotifications, markAsRead, getUnreadCount, markAllAsRead, markReadByType } from "../controllers/notification.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/all", isAuthenticated, getNotifications);
router.get("/unread-count", isAuthenticated, getUnreadCount);
router.put("/read/:id", isAuthenticated, markAsRead);
router.put("/mark-all-read", isAuthenticated, markAllAsRead);
router.put("/mark-read-type/:type", isAuthenticated, markReadByType);

export default router;