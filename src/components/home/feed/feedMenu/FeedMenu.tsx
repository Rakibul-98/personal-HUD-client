"use client";

import React from "react";
import { Play, Pause, Zap } from "lucide-react";
import { useTheme } from "../../../ThemeProvider/ThemeProvider";

interface FeedMenuProps {
  isAutoScroll: boolean;
  onAutoScrollToggle: () => void;
  onFetchNow: () => void;
}

export default function FeedMenu({
  isAutoScroll,
  onAutoScrollToggle,
  onFetchNow,
}: FeedMenuProps) {
  const { isDarkMode } = useTheme();
  return (
    <div className="mb-3">
      <div
        className={`flex flex-col md:flex-row justify-between gap-3 items-center ${
          isDarkMode ? "bg-white/5" : "bg-gray-500/20"
        } backdrop-blur p-3`}
      >
        <h3 className="text-xl font-semibold capitalize">
          All Your need is here
        </h3>
        <div className="flex gap-3 items-center">
          <button
            onClick={onAutoScrollToggle}
            className={`${
              isDarkMode ? "bg-gray-100/10" : "bg-gray-500/20"
            } hover:bg-gray-100/20 py-1 px-2 cursor-pointer`}
          >
            {isAutoScroll ? (
              <div className="flex gap-1 items-center">
                <Pause className="h-4 w-4" />
                <p>Stop Auto Scroll</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <Play className="h-4 w-4" />
                <p>Start Auto Scroll</p>
              </div>
            )}
          </button>
          <button
            onClick={onFetchNow}
            className={`${
              isDarkMode ? "bg-gray-100/10" : "bg-gray-500/20"
            } hover:bg-gray-100/20 rounded-none cursor-pointer flex gap-1 items-center py-1 px-2`}
          >
            <Zap className="h-4 w-4 fill-blue-500 text-blue-600" />{" "}
            <p>Fetch Now</p>
          </button>
        </div>
      </div>
    </div>
  );
}
