"use client";
import React, { useState } from "react";
import Header from "../../components/home/header/Header";
import LeftBar from "../../components/home/leftbar/LeftBar";
import RightBar from "../../components/home/rightbar/RightBar";
import ProtectedRoute from "../../components/auth/ProtectedRoutes";
import { Menu, PanelRightClose, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "../../components/ThemeProvider/ThemeProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleLeft = () => {
    setShowLeft(!showLeft);
    setShowRight(false);
  };
  const toggleRight = () => {
    setShowRight(!showRight);
    setShowLeft(false);
  };

  const isFeedPage = pathname === "/feed";
  const isBookmarkPage = pathname === "/bookmark";

  return (
    <ProtectedRoute>
      <Header />
      <main
        className={`grid grid-cols-1 md:grid-cols-4 
          ${isFeedPage ? "lg:grid-cols-6" : "lg:grid-cols-5"}
          relative`}
      >
        {/* LEFT SIDEBAR */}
        <div
          className={`
            ${showLeft ? "absolute z-50 w-64 h-full" : "hidden"} 
            md:block md:static md:w-auto md:h-auto 
            lg:col-span-1 md:col-span-1
          `}
        >
          <LeftBar />
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">{children}</div>

        {/* RIGHT SIDEBAR */}
        {isFeedPage && !isBookmarkPage && (
          <div
            className={`
              ${showRight ? "absolute right-0 z-50 w-64 h-full" : "hidden"} 
              lg:block lg:static lg:w-auto lg:h-auto 
              lg:col-span-1
            `}
          >
            <RightBar />
          </div>
        )}

        <button
          onClick={toggleLeft}
          className={`absolute transition-all z-50 cursor-pointer md:hidden
              ${showLeft ? "left-52 top-4" : "left-4 top-1"}
            `}
        >
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full">
            {isDarkMode && (
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur animate-pulse"></span>
            )}
            <span className="relative flex items-center justify-center p-2 rounded-md bg-gray-700 shadow-lg">
              {showLeft ? (
                <X size={18} className="text-white" />
              ) : (
                <Menu size={18} className="text-white" />
              )}
            </span>
          </span>
        </button>
        {isFeedPage && !isBookmarkPage && (
          <button
            onClick={toggleRight}
            className={`absolute transition-all z-50 cursor-pointer
              right-4
              ${showRight ? "top-4" : "top-1"}
              md:block lg:hidden
            `}
          >
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full">
              {isDarkMode && (
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur animate-pulse"></span>
              )}
              <span className="relative flex items-center justify-center p-2 rounded-md bg-gray-700 shadow-lg">
                {showRight ? (
                  <X size={18} className="text-white" />
                ) : (
                  <PanelRightClose size={18} className="text-white" />
                )}
              </span>
            </span>
          </button>
        )}
      </main>
    </ProtectedRoute>
  );
}
