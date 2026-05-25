"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FileDown } from "lucide-react";
import Piechart from "../Piechart";
import Linegraph from "../Linegraph";
import { useLanguage } from "@/context/LanguageContext";

const Dashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        totalEmission: 0,
        todayEmission: 0,
        totalActivities: 0,
        ecoScore: "",
    });
    const [categoryStats, setCategoryStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);

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

    // Fetch Category Stats
    const fetchCategoryStats = async () => {
        try {
            const res = await axios.get(
                "https://carbon-footprint-tracker-4dxj.onrender.com/activity/category-stats",
                getAuthHeaders()
            );
            setCategoryStats(res.data.categoryStats || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Weekly Stats
    const fetchWeeklyStats = async () => {
        try {
            const res = await axios.get(
                "https://carbon-footprint-tracker-4dxj.onrender.com/activity/weekly-stats",
                getAuthHeaders()
            );
            setWeeklyStats(res.data.weeklyStats || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Get emission for category
    const getCategoryEmission = (categoryName) => {
        const found = categoryStats.find(item => item.category === categoryName);
        return found ? Number(found.emission).toFixed(1) : "0.0";
    };

    // Get percentage for category
    const getCategoryPercentage = (categoryName) => {
        const found = categoryStats.find(item => item.category === categoryName);
        return found ? `${Number(found.percentage).toFixed(0)}%` : "0%";
    };

    // Compute analytics
    const getWeeklyAnalytics = () => {
        if (!weeklyStats || weeklyStats.length === 0) {
            return { max: null, min: null, avg: "0.0", total: "0.0" };
        }

        let maxVal = -Infinity;
        let maxDay = "";
        let minVal = Infinity;
        let minDay = "";
        let sum = 0;

        weeklyStats.forEach((item) => {
            const val = Number(item.emission) || 0;
            sum += val;
            if (val > maxVal) {
                maxVal = val;
                maxDay = item.day;
            }
            if (val < minVal) {
                minVal = val;
                minDay = item.day;
            }
        });

        const avg = (sum / weeklyStats.length).toFixed(1);
        return {
            max: maxVal !== -Infinity ? { day: maxDay, value: maxVal.toFixed(1) } : null,
            min: minVal !== Infinity ? { day: minDay, value: minVal.toFixed(1) } : null,
            avg,
            total: sum.toFixed(1),
        };
    };

    const analytics = getWeeklyAnalytics();

    useEffect(() => {
        fetchStats();
        fetchCategoryStats();
        fetchWeeklyStats();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[#f5f7f2] px-4 sm:px-8 lg:px-16 pt-24 pb-16 print:hidden">

                {/* Top Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

                    {/* Left */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#1e2a03] mt-2 leading-tight">
                            {t("dashboardTitle")}
                        </h1>

                        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl">
                            {t("dashboardDesc")}
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-[#41521F] hover:bg-[#88AB75] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                            <FileDown size={16} />
                            {t("downloadPDF")}
                        </button>

                        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#95A472]/20 shadow-sm min-w-[160px]">
                            <p className="text-[10px] text-[#95A472] font-semibold uppercase tracking-wider">
                                {t("ecoStatus")}
                            </p>

                            <h1
                                className={`text-lg font-bold mt-1 ${stats.ecoScore === "Bad ⚠️"
                                    ? "text-red-600"
                                    : stats.ecoScore === "Better 🍃"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                            >
                                {stats.ecoScore || "N/A"}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Total Emission */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("totalEmissionCard")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a03] group-hover:bg-[#DBD56E] transition-colors duration-300"></div>
                        </div>

                        <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                            {stats.totalEmission} kg
                        </h1>

                        <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                            {t("totalEmissionDesc")}
                        </p>
                    </div>

                    {/* Today Emission */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("todayEmissionCard")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a03] group-hover:bg-[#DBD56E] transition-colors duration-300"></div>
                        </div>

                        <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                            {stats.todayEmission} kg
                        </h1>

                        <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                            {t("todayEmissionDesc")}
                        </p>
                    </div>

                    {/* Activities */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("activitiesCard")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a03] group-hover:bg-[#DBD56E] transition-colors duration-300"></div>
                        </div>

                        <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                            {stats.totalActivities}
                        </h1>

                        <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                            {t("activitiesDesc")}
                        </p>
                    </div>

                    {/* Eco Score */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("ecoScoreCard")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a03] group-hover:bg-[#DBD56E] transition-colors duration-300"></div>
                        </div>

                        <h1
                            className={`text-xl font-bold mt-1.5 tracking-tight transition-colors duration-300 group-hover:text-white ${stats.ecoScore === "Bad ⚠️"
                                ? "text-red-500"
                                : stats.ecoScore === "Better 🍃"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                }`}
                        >
                            {stats.ecoScore ? stats.ecoScore.split(" ")[0] : "N/A"}
                        </h1>

                        <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                            {t("ecoScoreDesc")}
                        </p>
                    </div>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                    {/* Peak Day Card */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("peakEmissionDay")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 transition-colors duration-300"></div>
                        </div>
                        {analytics.max ? (
                            <div className="mt-1.5">
                                <h1 className="text-xl font-bold text-red-600 group-hover:text-red-400 tracking-tight transition-colors duration-300">
                                    {analytics.max.value} kg
                                </h1>
                                <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                    {t("peakLoggedOn")} {analytics.max.day}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-1.5">
                                <h1 className="text-xl font-bold text-gray-400 group-hover:text-gray-300 tracking-tight transition-colors duration-300">
                                    N/A
                                </h1>
                                <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                    {t("noActivities")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Greenest Day Card */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("greenestDay")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 transition-colors duration-300"></div>
                        </div>
                        {analytics.min ? (
                            <div className="mt-1.5">
                                <h1 className="text-xl font-bold text-green-600 group-hover:text-green-400 tracking-tight transition-colors duration-300">
                                    {analytics.min.value} kg
                                </h1>
                                <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                    {t("peakLoggedOn")} {analytics.min.day}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-1.5">
                                <h1 className="text-xl font-bold text-gray-400 group-hover:text-gray-300 tracking-tight transition-colors duration-300">
                                    N/A
                                </h1>
                                <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                    {t("noActivities")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Daily Average Card */}
                    <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 group-hover:text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300">
                                {t("dailyAverage")}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a03] group-hover:bg-[#DBD56E] transition-colors duration-300"></div>
                        </div>
                        <div className="mt-1.5">
                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white tracking-tight transition-colors duration-300">
                                {analytics.avg} kg
                            </h1>
                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("co2PerDay")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Charts Grid - 1/3 Piechart and 2/3 Linegraph */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                    <div className="lg:col-span-1 h-full">
                        <Piechart />
                    </div>
                    <div className="lg:col-span-2 h-full">
                        <Linegraph />
                    </div>
                </div>

                {/* Live Activity Categories */}
                <div className="mt-14">

                    {/* Heading */}
                    <div className="flex items-center justify-between mb-2">

                        <div>
                            <h1 className="text-xl font-bold text-[#1e2a03] uppercase ">
                                {t("activityCategories")}
                            </h1>
                        </div>

                        {/* Live Badge */}
                        <div className="hidden sm:flex items-center gap-2 bg-[#eef6e8] px-4 py-2 rounded-full border border-[#95A472]/10">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-900 animate-pulse"></div>
                            <p className="text-xs font-medium text-[#1e2a03]">
                                {t("liveActivity")}
                            </p>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                        {/* Transport */}
                        <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg group-hover:scale-110 transition-all duration-300">🚗</span>
                                    <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                                        {t("categoryTransport")}
                                    </h2>
                                </div>
                                <div className="bg-[#f5f7f2] group-hover:bg-[#DBD56E]/20 px-2 py-0.5 rounded-full border border-[#95A472]/10 transition-colors duration-300">
                                    <p className="text-[8px] font-medium text-[#1e2a03] group-hover:text-[#DBD56E] transition-colors duration-300">
                                        {t("active")}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                                {getCategoryEmission("transport")} kg
                            </h1>

                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("transportDetails")}
                            </p>

                            <div className="mt-3 flex justify-end">
                                <Link href="/tracker">
                                    <button className="bg-[#1e2a03] hover:bg-[#88AB75] group-hover:bg-[#DBD56E] text-white group-hover:text-[#1e2a03] text-[9px] font-semibold px-2.5 py-1 rounded transition-all duration-300 shadow">
                                        {t("trackButton")}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Electricity */}
                        <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg group-hover:scale-110 transition-all duration-300">⚡</span>
                                    <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                                        {t("categoryElectricity")}
                                    </h2>
                                </div>
                                <div className="bg-[#f5f7f2] group-hover:bg-[#DBD56E]/20 px-2 py-0.5 rounded-full border border-[#95A472]/10 transition-colors duration-300">
                                    <p className="text-[8px] font-medium text-[#1e2a03] group-hover:text-[#DBD56E] transition-colors duration-300">
                                        {t("active")}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                                {getCategoryEmission("electricity")} kg
                            </h1>

                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("electricityDetails")}
                            </p>

                            <div className="mt-3 flex justify-end">
                                <Link href="/tracker">
                                    <button className="bg-[#1e2a03] hover:bg-[#88AB75] group-hover:bg-[#DBD56E] text-white group-hover:text-[#1e2a03] text-[9px] font-semibold px-2.5 py-1 rounded transition-all duration-300 shadow">
                                        {t("trackButton")}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Food */}
                        <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg group-hover:scale-110 transition-all duration-300">🥗</span>
                                    <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                                        {t("categoryFood")}
                                    </h2>
                                </div>
                                <div className="bg-[#f5f7f2] group-hover:bg-[#DBD56E]/20 px-2 py-0.5 rounded-full border border-[#95A472]/10 transition-colors duration-300">
                                    <p className="text-[8px] font-medium text-[#1e2a03] group-hover:text-[#DBD56E] transition-colors duration-300">
                                        {t("active")}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                                {getCategoryEmission("food")} kg
                            </h1>

                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("foodDetails")}
                            </p>

                            <div className="mt-3 flex justify-end">
                                <Link href="/tracker">
                                    <button className="bg-[#1e2a03] hover:bg-[#88AB75] group-hover:bg-[#DBD56E] text-white group-hover:text-[#1e2a03] text-[9px] font-semibold px-2.5 py-1 rounded transition-all duration-300 shadow">
                                        {t("trackButton")}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Recycling */}
                        <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg group-hover:scale-110 transition-all duration-300">♻️</span>
                                    <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                                        {t("categoryRecycling")}
                                    </h2>
                                </div>
                                <div className="bg-[#f5f7f2] group-hover:bg-[#DBD56E]/20 px-2 py-0.5 rounded-full border border-[#95A472]/10 transition-colors duration-300">
                                    <p className="text-[8px] font-medium text-[#1e2a03] group-hover:text-[#DBD56E] transition-colors duration-300">
                                        {t("active")}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                                {getCategoryEmission("waste")} kg
                            </h1>

                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("recyclingDetails")}
                            </p>

                            <div className="mt-3 flex justify-end">
                                <Link href="/tracker">
                                    <button className="bg-[#1e2a03] hover:bg-[#88AB75] group-hover:bg-[#DBD56E] text-white group-hover:text-[#1e2a03] text-[9px] font-semibold px-2.5 py-1 rounded transition-all duration-300 shadow">
                                        {t("trackButton")}
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {/* water */}
                        <div className="group bg-white hover:bg-[#1e2a03] border border-[#95A472]/20 rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg group-hover:scale-110 transition-all duration-300">💧</span>
                                    <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                                        {t("categoryWater")}
                                    </h2>
                                </div>
                                <div className="bg-[#f5f7f2] group-hover:bg-[#DBD56E]/20 px-2 py-0.5 rounded-full border border-[#95A472]/10 transition-colors duration-300">
                                    <p className="text-[8px] font-medium text-[#1e2a03] group-hover:text-[#DBD56E] transition-colors duration-300">
                                        {t("active")}
                                    </p>
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-[#1e2a03] group-hover:text-white mt-1.5 tracking-tight transition-colors duration-300">
                                {getCategoryEmission("water")} liters
                            </h1>

                            <p className="text-gray-400 group-hover:text-gray-300 mt-1 text-[10px] transition-colors duration-300">
                                {t("waterDetails")}
                            </p>

                            <div className="mt-3 flex justify-end">
                                <Link href="/tracker">
                                    <button className="bg-[#1e2a03] hover:bg-[#88AB75] group-hover:bg-[#DBD56E] text-white group-hover:text-[#1e2a03] text-[9px] font-semibold px-2.5 py-1 rounded transition-all duration-300 shadow">
                                        {t("trackButton")}
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            {/* Printable Report (Hidden on screen, visible on print) */}
            <div className="hidden print:block bg-white text-gray-800 p-8 min-h-screen">
                {/* Top Green Accent bar */}
                <div className="w-full h-2 bg-[#41521F] rounded-full mb-6"></div>

                {/* Document Header */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1e2a03] tracking-wide italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Vashudha
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">{t("reportSubtitle")}</p>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 space-y-1">
                        <p><span className="font-bold text-gray-700">{t("dateGenerated")}</span> {new Date().toLocaleDateString()}</p>
                        <p><span className="font-bold text-gray-700">{t("accountOwner")}</span> {typeof window !== "undefined" && localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : "User"}</p>
                    </div>
                </div>

                {/* Stats Summary Card */}
                <div className="grid grid-cols-4 gap-4 mb-6 border-y border-gray-100 py-4">
                    <div className="text-center border-r border-gray-100 last:border-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t("totalCarbonEmission")}</p>
                        <h2 className="text-xl font-black text-[#1e2a03] mt-1">{stats.totalEmission} kg CO₂</h2>
                    </div>
                    <div className="text-center border-r border-gray-100 last:border-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t("todaysGeneration")}</p>
                        <h2 className="text-xl font-black text-[#1e2a03] mt-1">{stats.todayEmission} kg CO₂</h2>
                    </div>
                    <div className="text-center border-r border-gray-100 last:border-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t("activitiesTracked")}</p>
                        <h2 className="text-xl font-black text-[#1e2a03] mt-1">{stats.totalActivities}</h2>
                    </div>
                    <div className="text-center last:border-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t("environmentalRating")}</p>
                        <h2 className={`text-xl font-black mt-1 ${stats.ecoScore === "Bad ⚠️"
                            ? "text-red-600"
                            : stats.ecoScore === "Better 🍃"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}>
                            {stats.ecoScore || "N/A"}
                        </h2>
                    </div>
                </div>

                {/* Category Breakdown Table */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-extrabold text-[#1e2a03] uppercase tracking-widest mb-3">{t("emissionsBreakdown")}</h3>
                    <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                                <th className="py-2 px-1">{t("sourceCategory")}</th>
                                <th className="py-2 px-1 text-right">{t("emissionsValue")}</th>
                                <th className="py-2 px-1 text-right">{t("contribution")}</th>
                                <th className="py-2 px-1 text-right pl-6">{t("impactStatus")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 px-1 font-semibold text-gray-700">🚗 {t("categoryTransport")}</td>
                                <td className="py-2 px-1 text-right font-bold text-gray-800">{getCategoryEmission("transport")} kg CO₂</td>
                                <td className="py-2 px-1 text-right font-bold text-gray-800">{getCategoryPercentage("transport")}</td>
                                <td className="py-2 px-1 text-right text-gray-400">{t("transitImpactDesc")}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 px-1 font-semibold text-gray-700">⚡ {t("categoryElectricity")}</td>
                                <td className="py-2 px-1 text-right font-bold text-gray-800">{getCategoryEmission("electricity")} kg CO₂</td>
                                <td className="py-2 px-1 text-right font-bold text-gray-800">{getCategoryPercentage("electricity")}</td>
                                <td className="py-2 px-1 text-right text-gray-400">{t("electricityImpactDesc")}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2 px-1 font-semibold text-gray-700">🥗 {t("categoryFood")}</td>
                                <td className="py-2.5 px-1 text-right font-bold text-gray-800">{getCategoryEmission("food")} kg CO₂</td>
                                <td className="py-2.5 px-1 text-right font-bold text-gray-800">{getCategoryPercentage("food")}</td>
                                <td className="py-2.5 px-1 text-right text-gray-400">{t("foodImpactDesc")}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2.5 px-1 font-semibold text-gray-700">♻️ {t("categoryRecycling")}</td>
                                <td className="py-2.5 px-1 text-right font-bold text-green-600">-{getCategoryEmission("waste")} kg CO₂</td>
                                <td className="py-2.5 px-1 text-right font-bold text-green-600">{getCategoryPercentage("waste")}</td>
                                <td className="py-2.5 px-1 text-right text-gray-400">{t("recyclingImpactDesc")}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-2.5 px-1 font-semibold text-gray-700">💧 {t("categoryWater")}</td>
                                <td className="py-2.5 px-1 text-right font-bold text-green-600">-{getCategoryEmission("water")} L offset</td>
                                <td className="py-2.5 px-1 text-right font-bold text-green-600">{getCategoryPercentage("water")}</td>
                                <td className="py-2.5 px-1 text-right text-gray-400">{t("waterImpactDesc")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Weekly Trend Section */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-extrabold text-[#1e2a03] uppercase tracking-widest mb-3">{t("weeklyEmissionTrend")}</h3>
                    <div className="grid grid-cols-7 gap-3">
                        {weeklyStats.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-2.5 text-center bg-gray-50/10">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{item.day}</p>
                                <h4 className="text-xs font-black text-[#1e2a03] mt-1">{Number(item.emission).toFixed(1)} kg</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Environmental Recommendation Section */}
                <div className="border border-[#95A472]/40 rounded-xl p-4 bg-[#f5f7f2]/40 mb-4 mt-2">
                    <h3 className="font-bold text-[#1e2a03] text-xs uppercase tracking-wider">{t("actionPlanTitle")}</h3>
                    <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">
                        {t("actionPlanDesc", { score: stats.ecoScore || "N/A" })}
                    </p>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-3 text-center text-[8px] text-gray-400 mt-4">
                    {t("reportFooter")}
                </div>
            </div>
        </>
    );
};

export default Dashboard;