import Activity from "../models/activity.js";
import Notification from "../models/notification.js";
import { emissionFactors } from "../utils/emisionFactors.js";
import {
    generateNotificationMessage,
} from "../utils/generateAIInsights.js";

import {
    createNotification,
} from "../utils/notificationService.js";

export const addActivity = async (req, res) => {
    try {

        const { category, type, value, unit } = req.body;

        const normalizedCategory =
            category.toLowerCase().trim();

        const normalizedType =
            type.toLowerCase().trim();

        // Default Factor
        let factor = 0;

        // Find Factor
        if (
            emissionFactors[normalizedCategory] &&
            emissionFactors[normalizedCategory][normalizedType] !== undefined
        ) {
            factor =
                emissionFactors[normalizedCategory][normalizedType];
        } else {

            // Fallback Factor
            factor = 0.1;
        }

        // Calculate Emission
        const carbonEmission =
            Number(value) * factor;

        // Save Activity
        const activity = await Activity.create({
            user: req.user._id,
            category: normalizedCategory,
            type: normalizedType,
            value,
            unit,
            carbonEmission:
                Number(carbonEmission.toFixed(2)),
        });

        // GENERATE AND SAVE NOTIFICATION SYNCHRONOUSLY
        try {
            // TOTAL USER EMISSION
            const userActivities = await Activity.find({
                user: req.user._id,
            });

            const totalEmission = Number(
                userActivities.reduce((acc, item) => acc + (item.carbonEmission || 0), 0).toFixed(2)
            );

            // FETCH RECENT NOTIFICATION MESSAGES FOR DIVERSIFICATION
            let previousMessages = [];
            try {
                const recentNotifications = await Notification.find({
                    user: req.user._id,
                })
                .sort({ createdAt: -1 })
                .limit(5);
                previousMessages = recentNotifications.map(n => `${n.title}: ${n.message}`);
            } catch (err) {
                console.log("Error fetching recent notifications for context:", err.message);
            }

            // GENERATE AI INSIGHT
            const aiInsight = await generateNotificationMessage({
                category: normalizedCategory,
                type: normalizedType,
                carbonEmission: Number(carbonEmission.toFixed(2)),
                totalEmission,
                previousMessages,
            });

            // CREATE AI NOTIFICATION
            await createNotification({
                user: req.user._id,
                title: aiInsight?.title || "AI Sustainability Insight 🤖",
                message: aiInsight?.message || "Continue building sustainable habits.",
                type: "ai",
            });
        } catch (err) {
            console.log("AI Insight Notification Error:", err.message);
        }

        res.status(201).json({
            success: true,
            message: "Activity Added Successfully",
            activity,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getWeeklyStats = async (req, res) => {
    try {
        const daysMap = {
            0: "Sun",
            1: "Mon",
            2: "Tue",
            3: "Wed",
            4: "Thu",
            5: "Fri",
            6: "Sat",
        };

        const today = new Date();
        const weeklyStats = [];

        // Generate last 7 days dynamically in chronological order
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            weeklyStats.push({
                day: daysMap[d.getDay()],
                date: d,
                emission: 0
            });
        }

        // Calculate start date (6 days ago at 00:00:00)
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        // Fetch user activities created since start date
        const activities = await Activity.find({
            user: req.user._id,
            createdAt: { $gte: startDate }
        });

        // Aggregate daily emissions
        activities.forEach((item) => {
            const activityDate = new Date(item.createdAt);
            weeklyStats.forEach((w) => {
                if (
                    activityDate.getDate() === w.date.getDate() &&
                    activityDate.getMonth() === w.date.getMonth() &&
                    activityDate.getFullYear() === w.date.getFullYear()
                ) {
                    w.emission += item.carbonEmission;
                }
            });
        });

        // Compute running cumulative total
        let runningTotal = 0;
        const formattedStats = weeklyStats.map((w) => {
            runningTotal += w.emission;
            return {
                day: w.day,
                emission: Number(runningTotal.toFixed(2))
            };
        });

        res.status(200).json({
            success: true,
            weeklyStats: formattedStats,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getTrackerStats = async (req, res) => {
    try {
        const activities = await Activity.find({
            user: req.user._id,
        });

        // Total Activities
        const totalActivities = activities.length;

        // Total Emission
        const totalEmission = Number(
            activities.reduce((acc, item) => acc + (item.carbonEmission || 0), 0).toFixed(2)
        );

        // Today's Emission
        const today = new Date();

        const todayEmission = Number(
            activities
                .filter((item) => {
                    const itemDate = new Date(item.createdAt);

                    return (
                        itemDate.getDate() === today.getDate() &&
                        itemDate.getMonth() === today.getMonth() &&
                        itemDate.getFullYear() === today.getFullYear()
                    );
                })
                .reduce((acc, item) => acc + (item.carbonEmission || 0), 0)
                .toFixed(2)
        );

        // Eco Score Logic
        let ecoScore = "";

        if (totalEmission <= 20) {
            ecoScore = "Best 🌱";
        } else if (totalEmission <= 50) {
            ecoScore = "Better 🍃";
        } else {
            ecoScore = "Bad ⚠️";
        }

        res.status(200).json({
            success: true,
            stats: {
                totalActivities,
                totalEmission: totalEmission.toFixed(2),
                todayEmission: todayEmission.toFixed(2),
                ecoScore,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity Not Found",
            });
        }

        await activity.deleteOne();

        res.status(200).json({
            success: true,
            message: "Activity Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getCategoryStats = async (req, res) => {
    try {

        // Fetch User Activities
        const activities = await Activity.find({
            user: req.user._id,
        });

        // Store Category Totals
        const categoryTotals = {};

        // Total Emission
        let totalEmission = 0;

        // Calculate Totals
        activities.forEach((item) => {
            const category = item.category;
            const emission = item.carbonEmission || 0;

            // Add Overall Total
            totalEmission += emission;

            // Add Category Total
            if (categoryTotals[category]) {
                categoryTotals[category] += emission;
            } else {
                categoryTotals[category] = emission;
            }
        });

        // Round overall total and categories to avoid floating-point issues
        totalEmission = Number(totalEmission.toFixed(2));
        Object.keys(categoryTotals).forEach((cat) => {
            categoryTotals[cat] = Number(categoryTotals[cat].toFixed(2));
        });

        // Convert to Percentage
        const categoryStats = Object.keys(categoryTotals).map(
            (category) => {

                const emission = categoryTotals[category];

                const percentage =
                    totalEmission > 0
                        ? ((emission / totalEmission) * 100).toFixed(1)
                        : 0;

                return {
                    category,
                    emission: Number(emission.toFixed(2)),
                    percentage: Number(percentage),
                };
            }
        );

        res.status(200).json({
            success: true,
            totalEmission: Number(totalEmission.toFixed(2)),
            categoryStats,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};