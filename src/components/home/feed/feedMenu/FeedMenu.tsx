"use client";

import React from "react";
import { Play, Pause, Zap, Loader2 } from "lucide-react";
import { useTheme } from "../../../ThemeProvider/ThemeProvider";

interface FeedMenuProps {
  isAutoScroll: boolean;
  onAutoScrollToggle: () => void;
  onFetchNow: () => void;
  refreshing?: boolean;
  totalItems?: number;
  page?: number;
  totalPages?: number;
}

export default function FeedMenu({
  isAutoScroll,
  onAutoScrollToggle,
  onFetchNow,
  refreshing = false,
  totalItems,
  page,
  totalPages,
}: FeedMenuProps) {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-white/5" : "bg-gray-500/20";
  const btnBg = isDarkMode ? "bg-gray-100/10 hover:bg-gray-100/20" : "bg-gray-500/20 hover:bg-gray-500/30";

  return (
    <div className="mb-3">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${bg} backdrop-blur p-3`}>
        <div>
          <h3 className="text-base font-semibold">Your Feed</h3>
          {totalItems !== undefined && (
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {totalItems} articles{totalPages && totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={onAutoScrollToggle}
            className={`${btnBg} py-1 px-2.5 text-sm cursor-pointer transition-colors`}
          >
            {isAutoScroll ? (
              <span className="flex gap-1 items-center"><Pause className="h-3.5 w-3.5" /> Pause</span>
            ) : (
              <span className="flex gap-1 items-center"><Play className="h-3.5 w-3.5" /> Auto</span>
            )}
          </button>
          <button
            onClick={onFetchNow}
            disabled={refreshing}
            className={`${btnBg} cursor-pointer flex gap-1 items-center py-1 px-2.5 text-sm transition-colors disabled:opacity-50`}
          >
            {refreshing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> <span>Fetching…</span></>
            ) : (
              <><Zap className="h-4 w-4 fill-blue-500 text-blue-600" /> <span>Fetch Now</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
