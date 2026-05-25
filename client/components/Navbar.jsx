"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Bell,
  Settings,
  Globe,
} from "lucide-react";

import SettingsModal from "@/components/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Notifications Count
  const fetchNotificationsCount = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const res = await axios.get("https://carbon-footprint-tracker-4dxj.onrender.com /notification/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  // Check Authentication & Fetch Count
  const checkToken = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    if (token) {
      fetchNotificationsCount();
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    checkToken();
    window.addEventListener("auth-change", checkToken);

    // Poll for unread notification count every 10 seconds
    const interval = setInterval(() => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        fetchNotificationsCount();
      }
    }, 10000);

    return () => {
      window.removeEventListener("auth-change", checkToken);
      clearInterval(interval);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 pt-4 overflow-x-hidden print:hidden">
      <nav className="bg-white/90 backdrop-blur-md border border-[#95A472]/20 shadow-lg rounded-2xl px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <h1
            className="text-2xl sm:text-3xl italic font-bold tracking-wide text-[#1e2a03] cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Vashudha
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification Bell */}
          {isLoggedIn && (
            <Link href="/notifications">
              <div className="relative cursor-pointer group">
                {/* Bell */}
                <div className="w-11 h-11 rounded-2xl bg-[#1e2a03] flex items-center justify-center shadow-lg border border-[#95A472]/20 transition-all duration-300 group-hover:scale-105">
                  <Bell size={20} className="text-[#DBD56E]" />
                </div>

                {/* Count */}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* Dashboard */}
          <Link href="/dashboard">
            <button className="flex items-center gap-2 bg-[#1e2a03] hover:bg-[#88AB75] text-white px-3 sm:px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow text-sm sm:text-base">
              <LayoutDashboard size={18} />
              <span className="hidden sm:block">{t("dashboard")}</span>
            </button>
          </Link>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#95A472] hover:scale-105 transition-all duration-300 shadow-md outline-none">
                <img
                  src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 border border-[#95A472]/20 shadow-2xl rounded-xl p-2 bg-white"
            >
              {!isLoggedIn ? (
                <>
                  {/* Login */}
                  <Link href="/login">
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-[#95A472]/20 text-[#41521F]">
                      <LogIn size={16} />
                      {t("login")}
                    </DropdownMenuItem>
                  </Link>

                  {/* Register */}
                  <Link href="/register">
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-[#95A472]/20 text-[#41521F]">
                      <UserPlus size={16} />
                      {t("register")}
                    </DropdownMenuItem>
                  </Link>
                </>
              ) : (
                <>
                  {/* community */}
                  <Link href="/community">
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-[#95A472]/20 text-[#41521F]">
                      <User size={16} />
                      {t("community")}
                    </DropdownMenuItem>
                  </Link>
                  {/* Earth */}
                  <Link href="/earth">
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-[#95A472]/20 text-[#41521F]">
                      <Globe size={16} />
                      {t("earth")}
                    </DropdownMenuItem>
                  </Link>

                  { /* settings */}
                  <DropdownMenuItem
                    onClick={() => setOpenSettings(true)}
                    className="cursor-pointer flex items-center gap-2 rounded-lg hover:bg-[#95A472]/20 text-[#41521F]"
                  >
                    <Settings size={16} />
                    {t("settings")}
                  </DropdownMenuItem>
                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-2 rounded-lg text-red-500 hover:bg-red-200"
                  >
                    <LogOut size={16} />
                    {t("logout")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal isOpen={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
};

export default Navbar;