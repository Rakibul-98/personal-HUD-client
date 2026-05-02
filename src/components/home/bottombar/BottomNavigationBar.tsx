"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Newspaper, Bookmark, Settings, LogOut, Focus, Settings2, ChartSpline } from "lucide-react";
import { useTheme } from "../../ThemeProvider/ThemeProvider";
import { useAppDispatch } from "../../../Redux/hooks";
import { logoutUser } from "../../../Redux/slices/authSlice";
import SettingsModal from "./SettingsModal";
import FocusModal from "./FocusModal";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
};

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showFocus, setShowFocus] = useState(false);

  const navItems: NavItem[] = [
    { id: "feed", href: "/feed", icon: Newspaper, label: "Feed" },
    { id: "bookmarks", href: "/bookmark", icon: Bookmark, label: "Bookmarks" },
    { id: "analytics", href: "/analytics", icon: ChartSpline, label: "Analytics" },
    { id: "settings", href: "/settings", icon: Settings, label: "Settings" },
    { id: "focus", icon: Focus, label: "Focus", action: () => setShowFocus(true) },
    { id: "sources", icon: Settings2, label: "Sources", action: () => setShowSettings(true) },
  ];

  const isActive = (item: NavItem) =>
    item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;

  const handleLogout = async () => {
    await dispatch(logoutUser()); // calls POST /users/logout → clears httpOnly cookie
    router.push("/");
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden ${isDarkMode
            ? "bg-gradient-to-t from-black/80 to-black/60 border-t border-gray-700/50"
            : "bg-gradient-to-t from-gray-100/90 to-gray-50/70 border-t border-gray-300/50"
          } backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <button
                  key={item.id}
                  onClick={() => item.href ? router.push(item.href) : item.action?.()}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${active
                      ? isDarkMode ? "bg-blue-500/30 text-blue-300" : "bg-blue-100 text-blue-600"
                      : isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-white/5" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
                    }`}
                >
                  <Icon size={19} />
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`h-6 w-px mx-1 ${isDarkMode ? "bg-gray-600/50" : "bg-gray-400/50"}`} />

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${isDarkMode ? "text-red-400 hover:bg-red-500/20" : "text-red-500 hover:bg-red-100/50"
              }`}
          >
            <LogOut size={19} />
            <span className="text-[10px] mt-0.5">Logout</span>
          </button>
        </div>
      </nav>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showFocus && <FocusModal onClose={() => setShowFocus(false)} />}

      {/* Spacer so content doesn't hide behind nav bar */}
      <div className="h-16 lg:h-0" />
    </>
  );
}
