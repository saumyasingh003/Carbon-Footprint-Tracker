"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { Bell } from "lucide-react";

const Notification = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  // Fetch Notifications
  const fetchNotifications =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          "https://carbon-footprint-tracker-4dxj.onrender.com/notification/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setNotifications(
          res.data.notifications
        );

        // Count Unread
        const unread =
          res.data.notifications.filter(
            (item) => !item.isRead
          );

        setUnreadCount(
          unread.length
        );

      } catch (error) {

        console.log(error);
      }
    };

  // Fetch On Load
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative w-fit cursor-pointer group">

      {/* Bell Icon */}
      <div className="w-12 h-12 rounded-2xl bg-[#1e2a03] flex items-center justify-center shadow-lg border border-[#95A472]/20 transition-all duration-300 group-hover:scale-105">

        <Bell
          size={22}
          className="text-[#DBD56E]"
        />

      </div>

      {/* Notification Count */}
      {unreadCount > 0 && (

        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center border-2 border-white shadow-md">

          <span className="text-white text-[11px] font-bold">

            {unreadCount}

          </span>

        </div>
      )}
    </div>
  );
};

export default Notification;