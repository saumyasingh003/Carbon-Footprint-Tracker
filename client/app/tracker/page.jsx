"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

import Form from "./components/Form";

const Tracker = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        totalEmission: 0,
        todayEmission: 0,
        totalActivities: 0,
        ecoScore: "",
    });

    const [activities, setActivities] = useState([]);

    // Helper to get authorization headers
    const getAuthHeaders = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    // Fetch Stats
    const fetchStats = async () => {
        try {
            const res = await axios.get(
                "https://carbon-footprint-tracker-4dxj.onrender.com/activity/stats",
                getAuthHeaders()
            );
            setStats(res.data.stats);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Activities
    const fetchActivities = async () => {
        try {
            const res = await axios.get(
                "https://carbon-footprint-tracker-4dxj.onrender.com/activity/my-activities",
                getAuthHeaders()
            );
            setActivities(res.data.activities);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchActivities();
    }, []);

    // Delete Activity
    const deleteActivity = async (id) => {
        try {
            await axios.delete(
                `https://carbon-footprint-tracker-4dxj.onrender.com/activity/delete/${id}`,
                getAuthHeaders()
            );

            toast.success(t("deletedSuccess"));
            fetchStats();
            fetchActivities();
            window.dispatchEvent(new Event("auth-change"));
        } catch (error) {
            toast.error(error.response?.data?.message || t("failedToDeleteActivity"));
            console.log(error);
        }
    };

    const getLocalizedCategoryName = (cat) => {
        if (!cat) return "";
        const keyMap = {
            transport: "categoryTransport",
            electricity: "categoryElectricity",
            food: "categoryFood",
            waste: "categoryRecycling",
            water: "categoryWater",
            shopping: "tracker", // fallback
        };
        const key = keyMap[cat.toLowerCase()];
        return key ? t(key) : cat;
    };

    return (
        <div className="min-h-screen bg-[#f5f7f2] pt-26 pb-20 px-5 md:px-10 lg:px-20">

            {/* Hero Section */}
            <div
                className="relative rounded-3xl overflow-hidden shadow-2xl h-[180px] flex items-center"
                style={{
                    backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/033/378/577/small_2x/the-beach-mountains-sunset-the-ocean-hd-wallpaper-ai-generated-free-photo.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 px-6 sm:px-10 text-white">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
                        {t("trackerTitle")}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                        {t("trackerDesc")}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                {/* Total Emission */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#95A472]/20">
                    <h2 className="text-gray-500 text-sm">
                        {t("totalEmissionCard")}
                    </h2>

                    <h1 className="text-3xl font-bold text-[#1e2a03] mt-2">
                        {stats.totalEmission} kg
                    </h1>
                </div>

                {/* Today */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#95A472]/20">
                    <h2 className="text-gray-500 text-sm">
                        {t("todayEmissionCard")}
                    </h2>

                    <h1 className="text-3xl font-bold text-[#1e2a03] mt-2">
                        {stats.todayEmission} kg
                    </h1>
                </div>

                {/* Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#95A472]/20">
                    <h2 className="text-gray-500 text-sm">
                        {t("activitiesCard")}
                    </h2>

                    <h1 className="text-3xl font-bold text-[#1e2a03] mt-2">
                        {stats.totalActivities}
                    </h1>
                </div>

                {/* Eco Score */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#95A472]/20">
                    <h2 className="text-gray-500 text-sm">
                        {t("ecoScoreCard")}
                    </h2>

                    <h1
                        className={`text-3xl font-bold mt-2 ${stats.ecoScore === "Bad ⚠️"
                            ? "text-red-500"
                            : stats.ecoScore === "Better 🍃"
                                ? "text-yellow-500"
                                : "text-green-600"
                            }`}
                    >
                        {stats.ecoScore}
                    </h1>
                </div>
            </div>

            {/* Main Section */}
            <div className="grid lg:grid-cols-2 gap-8 mt-12">

                {/* Form */}
                <Form
                    onActivityAdded={() => {
                        fetchStats();
                        fetchActivities();
                    }}
                />

                {/* Recent Activities */}
                <div className="bg-white rounded-3xl shadow-xl border border-[#95A472]/20 p-8">
                    <h2 className="text-3xl font-bold text-[#1e2a03] mb-2">
                        {t("recentActivities")}
                    </h2>

                    <p className="text-gray-500 mb-8">
                        {t("recentActivitiesDesc")}
                    </p>

                    <div className="space-y-5">
                        {activities.length > 0 ? (
                            activities.slice(0, 4).map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between bg-[#f5f7f2] rounded-2xl p-5 hover:shadow-md transition-all"
                                >
                                    <div>
                                        <h3 className="font-semibold text-[#1e2a03] capitalize">
                                            {getLocalizedCategoryName(item.category)} - {item.type}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {item.value} {item.unit}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <h1 className="font-bold text-[#1e2a03]">
                                            {item.carbonEmission} kg
                                        </h1>

                                        <button
                                            onClick={() =>
                                                deleteActivity(item._id)
                                            }
                                            className="text-red-500 text-sm hover:underline mt-1"
                                        >
                                            {t("deleteLink")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                {t("noActivities")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracker;