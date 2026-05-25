import express from "express";
import { addActivity, deleteActivity, getCategoryStats, getTrackerStats, getUserActivities, getWeeklyStats } from "../controllers/activity.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.post("/add", isAuthenticated, addActivity);
router.get("/my-activities", isAuthenticated, getUserActivities);
router.delete("/delete/:id", isAuthenticated, deleteActivity);
router.get("/category-stats",isAuthenticated,getCategoryStats);
router.get("/stats",isAuthenticated, getTrackerStats);
router.get("/weekly-stats", isAuthenticated, getWeeklyStats);

export default router;