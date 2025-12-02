/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Newspaper,
  Bookmark,
  Settings,
  LogOut,
  Focus,
  Settings2,
  ChartSpline,
} from "lucide-react";
import { useTheme } from "../../ThemeProvider/ThemeProvider";
import { useAppDispatch } from "../../../Redux/hooks";
import { logout } from "../../../Redux/slices/authSlice";
import SettingsModal from "./SettingsModal";
import FocusModal from "./FocusModal";

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
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
      id: "analytics",
      href: "/analytics",
      icon: ChartSpline,
      label: "Analytics",
    },
    {
      id: "settings",
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
    {
      id: "focus",
      icon: Focus,
      label: "Focus",
      action: () => setShowFocus(true),
    },
    {
      id: "sources",
      icon: Settings2,
      label: "Sources",
      action: () => setShowSettings(true),
    },
  ];

  const handleNavClick = (item: any) => {
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
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden ${
          isDarkMode
            ? "bg-gradient-to-t from-black/80 to-black/60 border-t border-gray-700/50"
            : "bg-gradient-to-t from-gray-100/80 to-gray-50/60 border-t border-gray-300/50"
        } backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.id === "feed" && pathname === "/feed") ||
                (item.id === "bookmarks" && pathname === "/bookmark") ||
                (item.id === "settings" && pathname === "/settings") ||
                (item.id === "analytics" && pathname === "/analytics");

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-500/40"
                        : "bg-blue-400/40"
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

          <div
            className={`h-6 w-px mx-1 ${
              isDarkMode ? "bg-gray-600/50" : "bg-gray-400/50"
            }`}
          />

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
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {showFocus && <FocusModal onClose={() => setShowFocus(false)} />}

      <div className="h-20 md:h-0" />
    </>
  );
}
