"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Trophy, 
  ArrowLeft,
  Check,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

const NotificationsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/notification/all",
        getAuthHeaders()
      );
      setNotifications(res.data.notifications);

      // Check if there are any unread notifications
      const hasUnread = res.data.notifications.some(item => !item.isRead);
      if (hasUnread) {
        // Mark all as read in the backend to clear the count
        await axios.put(
          "http://localhost:5000/notification/mark-all-read",
          {},
          getAuthHeaders()
        );
        // Dispatch event to update unread count in Navbar
        window.dispatchEvent(new Event("auth-change"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("failedToLoadNotifications"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/notification/read/${id}`,
        {},
        getAuthHeaders()
      );
      toast.success(t("notificationMarkedRead"));
      
      // Update local state to avoid full reload
      setNotifications(prev => 
        prev.map(item => item._id === id ? { ...item, isRead: true } : item)
      );

      // Dispatch event to update unread count in Navbar
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.log(error);
      toast.error(t("failedToUpdateNotification"));
    }
  };

  // Handle click on notification card
  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      // Optimistically update state
      setNotifications(prev => 
        prev.map(n => n._id === item._id ? { ...n, isRead: true } : n)
      );
      try {
        await axios.put(
          `http://localhost:5000/notification/read/${item._id}`,
          {},
          getAuthHeaders()
        );
        // Dispatch event to update unread count in Navbar
        window.dispatchEvent(new Event("auth-change"));
      } catch (error) {
        console.log(error);
      }
    }

    if (item.link) {
      router.push(item.link);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to format time
  const getTypeConfig = (type) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="text-red-500" size={18} />,
          bgColor: "bg-red-50 border-red-100",
        };
      case "success":
        return {
          icon: <CheckCircle className="text-green-600" size={18} />,
          bgColor: "bg-green-50 border-green-100",
        };
      case "achievement":
        return {
          icon: <Trophy className="text-[#DBD56E]" size={18} />,
          bgColor: "bg-yellow-50 border-yellow-100",
        };
      case "community":
        return {
          icon: <MessageSquare className="text-blue-500" size={18} />,
          bgColor: "bg-blue-50 border-blue-100",
        };
      case "ai":
      default:
        return {
          icon: <Bell className="text-[#95A472]" size={18} />,
          bgColor: "bg-[#f5f7f2] border-[#95A472]/10",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] px-4 sm:px-6 pt-24 pb-12">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2">

          {/* Top Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1e2a03] mt-0.5 leading-tight">
              {t("notificationsHeading")}
            </h1>

            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 max-w-md">
              {t("notificationsDesc")}
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#95A472] border-t-transparent rounded-full animate-spin"></div>

              <p className="text-[#95A472] text-xs mt-3">
                {t("loadingInsights")}
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 6).map((item) => {
                const { icon, bgColor } = getTypeConfig(item.type);

                return (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group bg-white rounded-xl p-4 shadow-sm border ${
                      item.isRead
                        ? "border-gray-100 opacity-75"
                        : "border-[#95A472]/30"
                    } hover:shadow-md cursor-pointer transition-all duration-300 flex items-start gap-3.5 relative`}
                  >
                    {/* Unread Indicator */}
                    {!item.isRead && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl bg-[#1e2a03]" />
                    )}

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bgColor}`}
                    >
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2
                          className={`text-sm font-bold capitalize ${
                            item.isRead
                              ? "text-gray-600"
                              : "text-[#1e2a03]"
                          }`}
                        >
                          {item.title}
                        </h2>

                        <span className="text-[9px] text-gray-400 shrink-0">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          item.isRead
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {item.message}
                      </p>
                    </div>

                    {/* Mark Read */}
                    {!item.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item._id);
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 border border-transparent hover:border-gray-200 transition-all shrink-0 self-center"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#95A472]/20 p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#f5f7f2] flex items-center justify-center mx-auto mb-4 border border-[#95A472]/10">
                <Bell
                  className="text-[#95A472]"
                  size={20}
                />
              </div>

              <h2 className="text-sm font-bold text-[#1e2a03] mb-1">
                {t("noNotificationsYet")}
              </h2>

              <p className="text-gray-500 text-xs max-w-sm mx-auto">
                {t("allCaughtUp")}
              </p>

              <Link href="/tracker">
                <button className="mt-4 bg-[#1e2a03] hover:bg-[#88AB75] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
                  {t("trackActivityBtn")}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#95A472]/20 h-[650px]">
              {/* Image */}
              <img
                src="https://www.shutterstock.com/image-photo/tropical-beach-turquoise-waters-sandy-600nw-2549900893.jpg"
                alt="Sustainability"
                className="w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>

              {/* Content */}
              <div className="absolute inset-0 z-10 p-7 flex flex-col justify-between text-white">

                {/* Top Content */}
                <div>
                  <p className="uppercase tracking-[0.25em] text-[10px] text-[#DBD56E] font-bold">
                    {t("aiSustainabilityIntelligence")}
                  </p>

                  <h1 className="text-3xl font-bold mt-3 leading-tight">
                    {t("buildingSmarterClimate")}
                  </h1>

                  <p className="text-sm text-gray-200 mt-4 leading-relaxed">
                    {t("aiSustPanelDesc")}
                  </p>
                </div>

                {/* Bottom Sustainability Insights */}
                <div className="space-y-4">

                  {/* Insight Card */}
                  <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#DBD56E]">
                      {t("sustainabilityInsight")}
                    </p>

                    <h2 className="text-lg font-semibold mt-2 leading-snug">
                      {t("insightHeading")}
                    </h2>

                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      {t("insightBody")}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-10">
                    <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-4">
                      <p className="text-[10px] text-gray-300">
                        {t("globalCo2Rise")}
                      </p>

                      <h2 className="text-2xl font-bold mt-1">
                        +1.1°C
                      </h2>
                    </div>

                    <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-4">
                      <p className="text-[10px] text-gray-300">
                        {t("sustainableGoal")}
                      </p>

                      <h2 className="text-2xl font-bold mt-1">
                        {t("netZero")}
                      </h2>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;