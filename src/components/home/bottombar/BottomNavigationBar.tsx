/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Newspaper,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  Home,
} from "lucide-react";
import { useTheme } from "../../ThemeProvider/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { logout } from "../../../Redux/slices/authSlice";
import SettingsModal from "./SettingsModal";
import FocusModal from "./FocusModal";

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [showSettings, setShowSettings] = useState(false);
  const [showFocus, setShowFocus] = useState(false);

  const navItems = [
    {
      id: "feed",
      href: "/feed",
      icon: Newspaper,
      label: "Feed",
    },
    {
      id: "bookmarks",
      href: "/bookmark",
      icon: Bookmark,
      label: "Bookmarks",
    },
    {
      id: "focus",
      icon: Home,
      label: "Focus",
      action: () => setShowFocus(true),
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      action: () => setShowSettings(true),
    },
  ];

  const handleNavClick = (item: any) => {
    setActiveTab(item.id);
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
  };

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden ${
          isDarkMode
            ? "bg-gradient-to-t from-black/80 to-black/60 border-t border-gray-700/50"
            : "bg-gradient-to-t from-gray-100/80 to-gray-50/60 border-t border-gray-300/50"
        } backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-2 py-3">
          {/* Navigation Tabs */}
          <div className="flex gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.id === "feed" && pathname === "/feed") ||
                (item.id === "bookmarks" && pathname === "/bookmark");

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-500/40 text-blue-300"
                        : "bg-blue-400/40 text-blue-600"
                      : isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                  }`}
                  title={item.label}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-0.5 hidden">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div
            className={`h-6 w-px mx-1 ${
              isDarkMode ? "bg-gray-600/50" : "bg-gray-400/50"
            }`}
          />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? "text-red-400 hover:bg-red-500/20"
                : "text-red-600 hover:bg-red-100/50"
            }`}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Animated underline indicator */}
        <div
          className={`h-0.5 transition-all duration-300 ${
            isDarkMode ? "bg-blue-500" : "bg-blue-400"
          }`}
          style={{
            width: `${(1 / navItems.length) * 100}%`,
            marginLeft: `${
              navItems.findIndex((item) => {
                if (item.id === "feed" && pathname === "/feed") return true;
                if (item.id === "bookmarks" && pathname === "/bookmark")
                  return true;
                return false;
              }) *
              (100 / navItems.length)
            }%`,
          }}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Focus Modal */}
      {showFocus && <FocusModal onClose={() => setShowFocus(false)} />}

      {/* Bottom Padding for Main Content */}
      <div className="h-20 md:h-0" />
    </>
  );
}
